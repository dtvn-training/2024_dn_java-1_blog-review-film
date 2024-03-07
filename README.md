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

#### Admin:
- **Login**
- **Blog Management:**
  - View blog list
  - View detailed blog
  - Create, update, approve, delete, and restore blog
  - Search blog by title, film name, and reviewer name
- **Film Management:**
  - View film list
  - Create, update, delete, and restore film
- **Reviewer Management:**
  - View reviewer list
  - Create, delete, approve reviewer account
- **Category Management:**
  - View category list
  - Create, update, delete, and restore category
- **Logout**

#### Reviewer:
- **Register and Login**
- **Manage reviewer's blog:**
  - View blog list
  - View detailed blog
  - Create, update, and delete reviewer's blog
  - Search blog by title, film name
  - View film list
- **Logout**

#### Guest:
- **View Blog:**
  - View detailed blog
  - Search blog by title, film name, and reviewer name

### Database Design

#### Tables:
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

#### Admin:
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

#### Reviewer:
- **Login Page**
- **Blogs Page**
- **Blog Detail Page**
- **Add Blog Page**
- **Edit Blog Page**
- **Films Page**
- **Logout**

#### Guest:
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

### Diagrams

#### Use Case Diagram
![Use Case Diagram](https://github.com/dtvn-training/2024_dn_java-1_blog-review-film/assets/103616323/c466bc74-bb05-4a8e-93ad-dfc9dc058207)

#### Database Diagram
![Database Diagram](https://github.com/dtvn-training/2024_dn_java-1_blog-review-film/assets/103616323/29b6b54e-1954-439b-854a-f69c3a0c19d9)

### SQL Schema
--
-- Database: `blogreviewfilm`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` bigint(20) NOT NULL,
  `delete_flag` bit(1) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `insert_date_time` datetime(6) NOT NULL,
  `point` double NOT NULL,
  `post_time` datetime(6) NOT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `update_date_time` datetime(6) NOT NULL,
  `film_id` bigint(20) NOT NULL,
  `insert_by_user_id` bigint(20) NOT NULL,
  `reviewer_id` bigint(20) NOT NULL,
  `update_by_user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `delete_flag` bit(1) NOT NULL,
  `insert_date_time` datetime(6) NOT NULL,
  `name_category` varchar(255) DEFAULT NULL,
  `update_date_time` datetime(6) NOT NULL,
  `insert_by_user_id` bigint(20) NOT NULL,
  `update_by_user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contents`
--

CREATE TABLE `contents` (
  `id` bigint(20) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `insert_date_time` datetime(6) NOT NULL,
  `update_date_time` datetime(6) NOT NULL,
  `blog_id` bigint(20) NOT NULL,
  `insert_by_user_id` bigint(20) NOT NULL,
  `update_by_user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `films`
--

CREATE TABLE `films` (
  `id` bigint(20) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `delete_flag` bit(1) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL,
  `insert_date_time` datetime(6) NOT NULL,
  `name_film` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `update_date_time` datetime(6) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `insert_by_user_id` bigint(20) NOT NULL,
  `update_by_user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `delete_flag` bit(1) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `insert_date_time` datetime(6) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `role` tinyint(4) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `update_date_time` datetime(6) NOT NULL,
  `insert_by_user_id` bigint(20) NOT NULL,
  `update_by_user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKe7laa6wdg0qdnonjj1ggjwpmn` (`film_id`),
  ADD KEY `FKmtxtswg1awr0skgwmb2un1reb` (`insert_by_user_id`),
  ADD KEY `FK60ys8jf973vlciqc2no5plnmu` (`reviewer_id`),
  ADD KEY `FKa8618otks64heg8t8mjjegh2o` (`update_by_user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKhqhqtog9ylljwq22myaqad1b9` (`insert_by_user_id`),
  ADD KEY `FK7aq90esxjr1nw7ytnuwxqcqbn` (`update_by_user_id`);

--
-- Indexes for table `contents`
--
ALTER TABLE `contents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKt0ifdly804woqknr12jaoy08w` (`blog_id`),
  ADD KEY `FK6hx27lk0nq3xbxmulo4yj8exg` (`insert_by_user_id`),
  ADD KEY `FKd0smi4nuf2plu180uf2hne7a3` (`update_by_user_id`);

--
-- Indexes for table `films`
--
ALTER TABLE `films`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKf5rs4ila5dtovsrf1crhilxwh` (`category_id`),
  ADD KEY `FKr8npt14a0enx4deo4kkg79mt6` (`insert_by_user_id`),
  ADD KEY `FKffvbl5ejfxl8ra6uxwee7umng` (`update_by_user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_ag7rdm8vfqt72ytwbibig6tog` (`insert_by_user_id`),
  ADD UNIQUE KEY `UK_mro8rjss3m4wvptl38tun3jet` (`update_by_user_id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contents`
--
ALTER TABLE `contents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `films`
--
ALTER TABLE `films`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `FK60ys8jf973vlciqc2no5plnmu` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKa8618otks64heg8t8mjjegh2o` FOREIGN KEY (`update_by_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKe7laa6wdg0qdnonjj1ggjwpmn` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`),
  ADD CONSTRAINT `FKmtxtswg1awr0skgwmb2un1reb` FOREIGN KEY (`insert_by_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `FK7aq90esxjr1nw7ytnuwxqcqbn` FOREIGN KEY (`update_by_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKhqhqtog9ylljwq22myaqad1b9` FOREIGN KEY (`insert_by_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `contents`
--
ALTER TABLE `contents`
  ADD CONSTRAINT `FK6hx27lk0nq3xbxmulo4yj8exg` FOREIGN KEY (`insert_by_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKd0smi4nuf2plu180uf2hne7a3` FOREIGN KEY (`update_by_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKt0ifdly804woqknr12jaoy08w` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`);

--
-- Constraints for table `films`
--
ALTER TABLE `films`
  ADD CONSTRAINT `FKf5rs4ila5dtovsrf1crhilxwh` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `FKffvbl5ejfxl8ra6uxwee7umng` FOREIGN KEY (`update_by_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKr8npt14a0enx4deo4kkg79mt6` FOREIGN KEY (`insert_by_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FKhv2qk1dd8k6y15f87ylm3sy8l` FOREIGN KEY (`insert_by_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKm4r9e2kjfeab5rlypfm33j6t0` FOREIGN KEY (`update_by_user_id`) REFERENCES `users` (`id`);
COMMIT;



