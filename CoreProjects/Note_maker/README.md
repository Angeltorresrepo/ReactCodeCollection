# Note Maker

**Note Maker** is a web application built with React to create, view, download, and upload notes in JSON format. It allows you to add notes with titles and text, delete notes, download all notes to a JSON file, and upload notes from an external JSON file, with validation and visual notifications.

---

## Main features

- Create notes with title and text.
- Validation of non-empty title and text.
- Animated list of notes with CSS transitions.
- Delete notes individually with animation.
- Download all notes as a JSON file.
- Upload notes from a JSON file with full structure validation.
- Visual notifications with [React Toastify](https://github.com/fkhadra/react-toastify).
- File upload control with validation and alerts.

---

## Technologies used

- React 18
- React Toastify
- React Transition Group (animations)
- Material UI Icons (`@mui/icons-material`)
- CSS for custom styles and animations
- JavaScript (ES6+)

---

## Installation

 ```bash
   git clone URL-REPOSITORY
   cd note-maker
   npm install 
   npm start
```

## Usage

+ Enter the title and text of a note and press the button to add it.
+ The notes are displayed in the list below with animation.
+ You can delete a note by pressing the trash can icon.
+ To download all notes, press the Download Template icon.
+ To upload notes from a .json file, press the Upload Template icon and select a valid JSON file.
+ Uploaded notes are validated; if any do not meet the conditions (missing or empty fields), they are not added and an error message is displayed.

## Main libraries and dependencies
+ react and react-dom (React 18)
+ react-toastify for toast notifications
+ react-transition-group for entry/exit animations
+ @mui/icons-material for Material UI icons
+ Custom CSS in ./styles/

## Contact me
For questions, suggestions, or collaboration:

+ GitHub: Angeltorresrepo

+ Email: angel.torrmoz@gmail.com