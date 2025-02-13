import cors from "cors";
import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import { DOMParser } from "xmldom";
import { JSDOM } from "jsdom";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs } from "firebase/firestore";

const app = express();
const PORT = 3000;

const firebaseConfig = {
    apiKey: "AIzaSyCG50XRf7mjx5hgKKCChV8t91Jp04vTnhQ",
    authDomain: "unicournse.firebaseapp.com",
    projectId: "unicournse",
    storageBucket: "unicournse.firebasestorage.app",
    messagingSenderId: "771247932394",
    appId: "1:771247932394:web:63a445aad77a79c52de893",
    measurementId: "G-E2JHZ7R2XH"
};

const fapp = initializeApp(firebaseConfig);
const db = getFirestore(fapp);


app.use(cors());
app.use(express.json());

app.get("/scrape-courses", async (req, res) => {
    try {
        console.log("Fetching course subjects...");

        const response = await fetch(`https://courses.illinois.edu/cisapp/explorer/schedule/2025/spring.xml`);
        const data = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");
        const subjectElements = Array.from(xml.getElementsByTagName("subject"));

        for (const subject of subjectElements.slice(0, 1)) {
            const subjId = subject.getAttribute("id");
            const subjUrl = subject.getAttribute("href");

            console.log(`Fetching subject: ${subjId}`);

            const subjResponse = await fetch(`${subjUrl}`);
            const subjData = await subjResponse.text();
            const subjXml = parser.parseFromString(subjData, "text/xml");
            const courseElements = Array.from(subjXml.getElementsByTagName("course"));

            let courseList = [];

            for (const course of courseElements.slice(0, 1)) {
                const courseId = parseInt(course.getAttribute("id"), 10);
                const courseName = course.textContent;
                const courseUrl = course.getAttribute("href");

                console.log(`Fetching course: ${courseId} - ${courseName}`);

                const courseResponse = await fetch(`${courseUrl}`);
                const courseData = await courseResponse.text();
                const courseXml = parser.parseFromString(courseData, "text/xml");
                const creditHours = parseInt(courseXml.getElementsByTagName("creditHours")[0]?.textContent || "0", 10);
                const description = courseXml.getElementsByTagName("description")[0]?.textContent || "No description available";

                const sections = Array.from(courseXml.getElementsByTagName("section"));
                let sectionData = [];

                for (const section of sections) {
                    const formattedCourseId = courseId.toString().padStart(3, '0');
                    const sectionUrl = `https://courses.illinois.edu/cisapp/explorer/schedule/2025/spring/${subjId}/${formattedCourseId}/${section.getAttribute("id")}.xml`;

                    console.log(`Fetching section: ${sectionUrl}`);

                    const sectionResponse = await fetch(`${sectionUrl}`);
                    const sectionDataResponse = await sectionResponse.text();
                    const sectionXml = parser.parseFromString(sectionDataResponse, "text/xml");

                    const sectionNumber = sectionXml.getElementsByTagName("sectionNumber")[0]?.textContent.trim() || "N/A";
                    const partOfTerm = sectionXml.getElementsByTagName("partOfTerm")[0]?.textContent || "N/A";
                    const type = sectionXml.getElementsByTagName("type")[0]?.textContent || "N/A";
                    const startTime = sectionXml.getElementsByTagName("start")[0]?.textContent || "N/A";
                    const endTime = sectionXml.getElementsByTagName("end")[0]?.textContent || "N/A";
                    const daysOfTheWeek = sectionXml.getElementsByTagName("daysOfTheWeek")[0]?.textContent.trim() || "N/A";
                    const roomNumber = sectionXml.getElementsByTagName("roomNumber")[0]?.textContent || "N/A";
                    const buildingName = sectionXml.getElementsByTagName("buildingName")[0]?.textContent || "N/A";

                    const instructors = Array.from(sectionXml.getElementsByTagName("instructor"));
                    const instructorNamesArray = instructors.map(instructor =>
                        `Prof. ${instructor.getAttribute("firstName") || "N/A"} ${instructor.getAttribute("lastName") || "N/A"}`
                    );

                    const sortedInstructorNames = instructorNamesArray.sort().join(", ");

                    const sectionInfo = {
                        prof: sortedInstructorNames || "N/A",
                        code: sectionNumber || "N/A",
                        pot: partOfTerm || "N/A",
                        type: type || "N/A",
                        days: daysOfTheWeek || "N/A",
                        time: `${startTime || "N/A"} - ${endTime || "N/A"}`,
                        loc: buildingName || "N/A",
                        room: roomNumber || "N/A"
                    };

                    sectionData.push(sectionInfo);
                    console.log(`Stored under subcollection: ${sortedInstructorNames}`);
                }

                courseList.push({
                    code: courseId,
                    name: courseName,
                    credits: creditHours,
                    description: description,
                    gpa: 3.75,
                    comments: [],
                    sections: sectionData
                });
            }

            const subjectRef = doc(db, "Courses", subjId);
            await setDoc(subjectRef, { info: courseList }, { merge: true });
            console.log('Course List:');
            console.log(courseList);
            console.log(`✔ Successfully stored data for subject: ${subjId}`);
        }

        console.log("✔ All courses and sections successfully written to Firestore!");
        res.json({ message: "Scraping completed and data saved to Firestore." });

    } catch (error) {
        console.error("❌ Error fetching courses:", error);
        res.status(500).json({ error: "Failed to fetch courses" });
    }
});

app.get("/update-rmp-ratings", async (req, res) => {
    try {
        const coursesData = JSON.parse(fs.readFileSync('../src/content/courses.json', 'utf8'));
        
        for (const course of coursesData) {
            for (const [profName, profData] of Object.entries(course.sections)) {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/professor?name=${encodeURIComponent(profName)}`);
                    const result = await response.json();
                    
                    if (result.length > 0) {
                        profData.rmp = parseFloat(result[0].rating);
                    } else {
                        profData.rmp = 0;
                    }
                } catch (error) {
                    console.error(`Error fetching RMP rating for ${profName}:`, error);
                    profData.rmp = 0;
                }
            }
        }

        fs.writeFileSync('../src/content/courses.json', JSON.stringify(coursesData, null, 2));

        res.json({ message: "RMP ratings updated successfully" });
    } catch (error) {
        console.error("❌ Error updating RMP ratings:", error);
        res.status(500).json({ error: "Failed to update RMP ratings" });
    }
});

app.get("/professor-rating", async (req, res) => {
    try {
        const coursesSnapshot = await getDocs(collection(db, "Courses"));
        const updates = [];

        for (const doc of coursesSnapshot.docs.slice(0, 90)) {
            const data = doc.data();
            const updatedInfo = await Promise.all(data.info.map(async course => {
                course.sections = await Promise.all(course.sections.map(async section => {
                    const profNames = section.prof.split(", ").map(prof => prof.replace("Prof. ", ""));
                    const ratings = await Promise.all(profNames.map(async name => {
                        const response = await fetch(`http://127.0.0.1:5000/api/professor?name=${encodeURIComponent(name)}`);
                        const result = await response.json();
                        return result.length > 0 ? parseFloat(result[0].rating) : null;
                    }));
                    section.rmp = ratings.filter(rating => rating !== null);
                    return section;
                }));
                return course;
            }));

            updates.push(setDoc(doc.ref, { info: updatedInfo }, { merge: true }));
        }

        await Promise.all(updates);
        res.json({ message: "Professor ratings added to all sections." });
    } catch (error) {
        console.error("❌ Error updating professor ratings:", error);
        res.status(500).json({ error: "Failed to update professor ratings" });
    }
});

app.get("/restructure-sections", async (req, res) => {
    try {
        console.log("Fetching course subjects...");
        const response = await fetch(`https://courses.illinois.edu/cisapp/explorer/schedule/2025/spring.xml`);
        const data = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");
        const subjectElements = Array.from(xml.getElementsByTagName("subject"));

        for (const subject of subjectElements) {
            const subjId = subject.getAttribute("id");
            const subjUrl = subject.getAttribute("href");


            console.log(`Fetching subject: ${subjId}`);
            const subjResponse = await fetch(subjUrl);
            const subjData = await subjResponse.text();
            const subjXml = parser.parseFromString(subjData, "text/xml");
            const courseElements = Array.from(subjXml.getElementsByTagName("course"));

            let courseList = [];

            for (const course of courseElements) {
                const courseId = parseInt(course.getAttribute("id"), 10);
                const courseName = course.textContent;
                const courseUrl = course.getAttribute("href");
                console.log(`Processing course: ${courseId} - ${courseName}`);

                const courseResponse = await fetch(courseUrl);
                const courseData = await courseResponse.text();
                const courseXml = parser.parseFromString(courseData, "text/xml");
                const creditHours = parseInt(courseXml.getElementsByTagName("creditHours")[0]?.textContent || "0", 10);
                const description = courseXml.getElementsByTagName("description")[0]?.textContent || "No description available";
                const sections = Array.from(courseXml.getElementsByTagName("section"));
                
                let sectionsByProfessor = {};

                for (const section of sections) {
                    const formattedCourseId = courseId.toString().padStart(3, '0');
                    const sectionUrl = `https://courses.illinois.edu/cisapp/explorer/schedule/2025/spring/${subjId}/${formattedCourseId}/${section.getAttribute("id")}.xml`;

                    const sectionResponse = await fetch(sectionUrl);
                    const sectionDataResponse = await sectionResponse.text();
                    const sectionXml = parser.parseFromString(sectionDataResponse, "text/xml");
                    console.log(`Processing section: ${sectionXml.getElementsByTagName("sectionNumber")[0]?.textContent.trim()}`);

                    const sectionInfo = {
                        code: sectionXml.getElementsByTagName("sectionNumber")[0]?.textContent.trim() || "N/A",
                        days: sectionXml.getElementsByTagName("daysOfTheWeek")[0]?.textContent.trim() || "N/A",
                        loc: sectionXml.getElementsByTagName("buildingName")[0]?.textContent || "N/A",
                        pot: sectionXml.getElementsByTagName("partOfTerm")[0]?.textContent || "N/A",
                        room: sectionXml.getElementsByTagName("roomNumber")[0]?.textContent || "N/A",
                        time: `${sectionXml.getElementsByTagName("start")[0]?.textContent || "N/A"} - ${sectionXml.getElementsByTagName("end")[0]?.textContent || "N/A"}`,
                        type: sectionXml.getElementsByTagName("type")[0]?.textContent || "N/A",
                        rmp: 0,
                        gpa: 3.75
                    };

                    const instructors = Array.from(sectionXml.getElementsByTagName("instructor"));
                    instructors.forEach(instructor => {
                        const profName = instructor.textContent.trim();
                        if (!sectionsByProfessor[profName]) {
                            sectionsByProfessor[profName] = [];
                        }
                        sectionsByProfessor[profName].push(sectionInfo);
                    });
                }

                courseList.push({
                    ...course.data,
                    code: courseId,
                    name: courseName,
                    credits: creditHours,
                    description: description,
                    gpa: 3.75,
                    comments: [],
                    sections: sectionsByProfessor
                });
            }

            const subjectRef = doc(db, "Courses", subjId);
            await setDoc(subjectRef, { info: courseList }, { merge: true });
            console.log(`✔ Successfully updated sections for subject: ${subjId}`);
        }

        console.log("✔ All sections successfully restructured in Firestore!");
        res.json({ message: "Section restructuring completed." });

    } catch (error) {
        console.error("❌ Error restructuring sections:", error);
        res.status(500).json({ error: "Failed to restructure sections" });
    }
});

app.get("/courses", async (req, res) => {
    try {
        const coursesSnapshot = await getDocs(collection(db, "Courses"));
        const courses = [];

        coursesSnapshot.forEach(doc => {
            const data = doc.data();
            data.info.forEach(course => {
                courses.push({
                    subj: doc.id,
                    code: course.code,
                    name: course.name,
                    credits: course.credits,
                    gpa: course.gpa,
                    sections: course.sections
                });
            });
        });

        res.json(courses);
    } catch (error) {
        console.error("❌ Error fetching courses:", error);
        res.status(500).json({ error: "Failed to fetch courses" });
    }
});

app.get("/upload-courses", async (req, res) => {
    try {
        // Read courses.json file
        const coursesData = JSON.parse(fs.readFileSync('../src/content/courses.json', 'utf8'));
        
        // Group courses by subject
        const coursesBySubject = {};
        coursesData.forEach(course => {
            const subj = course.subj;
            if (!coursesBySubject[subj]) {
                coursesBySubject[subj] = [];
            }
            coursesBySubject[subj].push({
                code: course.code,
                name: course.name,
                credits: course.credits,
                gpa: course.gpa,
                sections: course.sections,
                description: course.description,
                comments: course.comments || []
            });
        });

        // Upload each subject's courses to Firestore
        const updates = [];
        for (const [subject, courses] of Object.entries(coursesBySubject)) {
            const subjectRef = doc(db, "Courses", subject);
            updates.push(setDoc(subjectRef, { info: courses }, { merge: true }));
        }

        await Promise.all(updates);
        console.log("✔ All courses successfully uploaded to Firestore!");
        res.json({ message: "Courses uploaded successfully to Firestore" });

    } catch (error) {
        console.error("❌ Error uploading courses:", error);
        res.status(500).json({ error: "Failed to upload courses" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});