# 2024_Intern_BKDN_DAC - Java-1 Team

## Requirement Document

**Objective:**
When customers want to watch a movie, they are often faced with various choices in selecting a film. Customers usually desire to know the initial storyline of the movie to decide whether it's worth watching. To meet this need, the Movie Review website is created to provide customers with an overview to facilitate decision-making.

This Movie Review website serves as a **multidimensional and interactive platform for reviewing movies**. It allows users to experience and share opinions about newly released films, fostering a diverse and rich film review community.

**System Requirements:**
- **Role-based authorization:** Admin, Reviewer, and Guest.
- **Admin manages reviewer and blog information.**
- **Reviewer manages their blogs.**
- **Guests can search and view blogs.**

### Functional Requirements

**Admin:**
- **Login**
- **Blog Management**
  - View blog list
  - View detailed blog
  - Create, update, approve, delete, and restore blog
  - Search blog by title, film name, and reviewer name
- **Film Management**
  - View film list
  - Create, update, delete, and restore film
- **Reviewer Management**
  - View reviewer list
  - Create, delete, approve reviewer account
- **Category Management**
  - View category list
  - Create, update, delete, and restore category
- **Logout**

**Reviewer:**
- **Register and Login**
- **Manage reviewer's blog**
  - View blog list
  - View detailed blog
  - Create, update, and delete reviewer's blog
  - Search blog by title, film name
  - View film list
- **Logout**

**Guest:**
- **View Blog**
  - View detailed blog
  - Search blog by title, film name, and reviewer name

### Database Design

**Tables:**
1. **Account:**
   - id, email, password, role, name, phone, status, insertDateTime, insertBy_AccountId, updateDateTime, updateBy_AccountId, deleteFlag.

2. **Blog:**
   - id, reviewerId, filmId, title, image, point, postTime, status, insertDateTime, insertBy_AccountId, updateDateTime, updateBy_AccountId, deleteFlag.

3. **Content:**
   - id, blogId, imageUrl, content, insertDateTime, insertBy_AccountId, updateDateTime, updateBy_AccountId.

4. **Film:**
   - id, categoryId, nameFilm, director, country, startDate, description, insertDateTime, insertBy_AccountId, updateDateTime, updateBy_AccountId, deleteFlag.

5. **Category:**
   - id, nameCategory, insertDateTime, insertBy_AccountId, updateDateTime, updateBy_AccountId, deleteFlag.

### User Interface

**Admin:**
- **Login Page**
- **Home Page**
- **Blogs Page**
- **Blog Detail Page**
- **Add Blog Page**
- **Edit Blog Page**
- **Restore Blog Page**
- **Reviewers Page**
- **Add Reviewer Account Page**
- **Restore Reviewer Page**
- **Films Page**
- **Add Film Page**
- **Edit Film Page**
- **Restore Film Page**

**Reviewer:**
- **Login Page**
- **Blogs Page**
- **Blog Detail Page**
- **Add Blog Page**
- **Edit Blog Page**
- **Films Page**
- **Logout**

**Guest:**
- **Home Page**
- **Blog Detail Page**
- **Logout**

### Technology Stack

**Programming Language:**
- **Back-end:** Java
- **Front-end:** HTML/CSS, JavaScript

**Frameworks:**
- **Back-end:** Spring Boot
- **Front-end:** ReactJS

**Database:**
- **MySQL**

Feel free to adapt and customize this README for your repository. Good luck with your project!
