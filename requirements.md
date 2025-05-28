# Arabic Learning Platform Requirements

## Overview

The Arabic Learning Platform is designed to facilitate Arabic language learning, with the current focus on morphology (ilmu shorof). This platform is built in collaboration with Arabic language professors to digitize the learning process. One of its key features is the integration of quizzes designed as assessment tools at the end of each learning chapter. Students can access these quizzes easily via QR codes embedded in their learning books, providing a practical learning experience. This system not only helps students measure their understanding of the material but also enables instructors to monitor student learning progress in a more structured and effective manner.

## Student Features

### Learning Module

- Students can view their most recently completed chapter
- Students can access a list of sub-chapters with associated lessons
- Students can start a lesson by clicking on it within a sub-chapter
- Students can complete questions within each lesson
- Students can answer questions by selecting from available options
- After completing questions, students can view their results
- Students can switch to a different chapter by accessing the chapter list
- In the chapter list, students can see their progress on each chapter
- Students can only access a chapter after completing the previous one
- Students receive visual indicators (stars) showing their performance level for each completed lesson

### Leaderboard

- Students can view the leaderboard showing students with the highest scores
- Students can see their own ranking and score on the leaderboard
- The leaderboard displays total accumulated points across all completed lessons

### Settings

- Students can edit their profile name

## Admin Features

The platform includes an admin interface with dashboard, chapters, students, and settings management.

### Dashboard

- Displays key metrics including:
  - Total number of students
  - Total number of chapters
  - Leaderboard of top-performing students
  - Score distribution visualization

### Chapter Management

- View a list of all chapters with numbering and name
- Add new chapters with number and name fields
- Access sub-chapter lists by clicking on a chapter (redirects to chapter detail page)
- On the chapter detail page:
  - Add new sub-chapters with number and name fields
  - Edit or delete the chapter
  - View a QR code that students can scan to access the specific sub-chapter
- View sub-chapter details by clicking on a sub-chapter in the table
- On the sub-chapter detail page:
  - View a list of lessons with numbering
  - Add new lessons with number field
  - Edit or delete the sub-chapter
- View lesson details by clicking on a lesson in the table
- On the lesson detail page:
  - View a list of questions in form format
  - Add new questions including the question text, answer options, and correct answer
  - Edit or delete the lesson
  - Questions can have multiple answer options with one correct answer

### Student Management

- View a list of all students with their scores and progress
- Access student details by clicking on a student in the table
- On the student detail page:
  - View a list of chapters completed by the student
  - Click on chapters to view details in a modal
  - The chapter detail modal shows sub-chapters and progress completed by the student
  - View student's performance metrics including scores

### Settings

- Toggle option to randomize questions
- Toggle option to randomize answers
- Configure default score value per question

## Technical Requirements

- Use Next.js 14+ with Pages Directory structure
- Implement TypeScript for all components
- Use tRPC for type-safe API routes
- Manage authentication with NextAuth.js
- Implement database operations using Prisma with PostgreSQL
- Use ShadCN UI components for consistent interface design
- Follow error handling best practices with appropriate user feedback
- Implement responsive design for both mobile and desktop views

## Data Models

The system uses the following primary data models:
- **Chapters** (Bab): Main learning units with number and name fields
- **Sub-chapters** (SubBab): Subdivisions of chapters with number and name fields
- **Lessons**: Educational content within sub-chapters with number field
- **Questions**: Assessment items within lessons with number and question text
- **Answers**: Options for questions with correct/incorrect flags
- **Student**: User profile with learning progress and scores
- **StudentLessonResults**: Tracking performance on completed lessons with score and star ratings
- **User**: Authentication and role management (admin/student)
- **Settings**: System-wide configuration options