INSERT INTO users (first_name, last_name, email, hashed_password, handicap, participating) VALUES
('Todd', 'Teigland', 'toddteigland@gmail.com', '$2b$10$wNNpf7GYkRybq4Bx4mkyVOLUROJ8m93j1KB.SrDOTXlliwH6SiIu6', 15, true),
('Brett', 'Mcconnell', 'brettmcconnell@gmail.com', '$2b$10$1He1u3FrLn1vHwsmULT1suYz1B.vog1vLzLlODUPQjPwhebv9jTze', 12, true),
('Lawson', 'Eberhard', 'lawsoneberhard@gmail.com', '$2b$10$7yvrlpK.ofBxKc0tTsQUjuCM2phAFBC1vX3H6rOKJ/Ul3y/qVi7y2', 15, true),
('Darren', 'Smith', 'darrensmith@gmail.com', '$2b$10$pqF6IdzXeBe/mGjnl8liGOFap0PdICHIu3v61ZDhxGCXzLFACp2mS', 26, true),
('Daniel', 'Eberhard', 'danieleberhard@gmail.com', '$2b$10$M/Fkniu/fcrHVF7dPWdAj.fbowAwc.sfLSAuZBKMAV2fHda2oF6p6', 19, true),
('John', 'Tsirimbis', 'johntsirimbis@gmail.com', '$2b$10$MngHiWP3H/IOjyygjVgeO..gHLKXHi3Hxoi6STjeWMB/XSq5D4tua', 22, true),
('Todd', 'Fanter', 'toddfanter@gmail.com', '$2b$10$4njx8F2.qJ2.uxndM5kCMOe.A1mw71E1oFGp9j43Q.XkebWAcLJAO', 30, true),
('Shane', 'Gudmanson', 'shanegudmanson@gmail.com', '$2b$10$eK46BCQF8Efotq30pH/1Z.xWNzkp4mIzQpEXpAN7bWg7o4RzizP9u', 30, false),
('Caleb', 'Henry', 'calebhenry@gmail.com', '$2b$10$/pt9QSL/q7CKWft.egb79u7l3rQuzRwZSqQ23FStWSF6q6dxp4sLq', 20, true),
('Tyson', 'Porritt', 'tysonporritt@gmail.com', '$2b$10$iSHd3fdcQ7ZcFFvjXsO7fOxa.39YEMoWWzRr4lFPJmMYfpbBXEzNu', 24, true),
('David', 'Jones', 'davidjones@gmail.com', '$2b$10$ql1AszJyHx.pbeTxYE8klOEXSHUZjgLPrYWBjuEGIB8ozShXghSfa', 22, true),
('Isaac', 'Viner', 'isaacviner@gmail.com', '$2b$10$i7JEUaFR8MTIJG7T9MS6PuwsRBYbhVu/Ceeh6PWWqcCaaPuvUxBpK', 17, true),
('Matt', 'Lebourdais', 'mattlebourdais@gmail.com', '$2b$10$yVqQdJSER04AH7AXqhbKtuEsJ/GThWuj77dpUk/x1RbHgODrX8Bbe', 21, true);

-- Seed the 'The Ledges of St George' course
INSERT INTO courses (course_name, address) VALUES 
('The Ledges of St George', 'St. George, Utah'),
('Sand Hollow', 'Hurricane, Utah'),
('Sand Hollow', 'Hurricane, Utah');

INSERT INTO rounds (course_id, date) VALUES
(1, '2024-05-13'), 
(2, '2024-05-14'), 
(3, '2024-05-12'); 
-- Insert tees for 'The Ledges of St George'
INSERT INTO tees (course_id, tee_name, color) VALUES 
(1, 'Black', 'Black'),
(1, 'Blue', 'Blue'),
(1, 'White', 'White'),
(2, 'Yellow', 'Yellow'),
(2, 'Green', 'Green'),
(2, 'Combo', 'Combo'),
(3, 'Yellow', 'Yellow'),
(3, 'Green', 'Green'),
(3, 'Combo', 'Combo');


-- ROUND 1 ----------------------------------------------------------------
-- Assume the tee_ids are 1 for Black, 2 for Blue, etc.
-- Insert holes for Black tee
INSERT INTO holes (tee_id, hole_number, yardage, par, handicap) VALUES 
(1, 1, 405, 4, 11),
(1, 2, 231, 3, 13),
(1, 3, 571, 5, 7),
(1, 4, 456, 4, 1),
(1, 5, 161, 3, 15),
(1, 6, 430, 4, 5),
(1, 7, 589, 5, 9),
(1, 8, 372, 4, 17),
(1, 9, 422, 4, 3),
(1, 10, 233, 3, 16),
(1, 11, 531, 5, 6),
(1, 12, 169, 3, 18),
(1, 13, 419, 4, 14),
(1, 14, 389, 4, 12),
(1, 15, 320, 4, 8),
(1, 16, 600, 5, 2),
(1, 17, 408, 4, 10),
(1, 18, 439, 4, 4);

-- Insert holes for Blue tee
INSERT INTO holes (tee_id, hole_number, yardage, par, handicap) VALUES 
(2, 1, 376, 4, 11),
(2, 2, 220, 3, 13),
(2, 3, 538, 5, 7),
(2, 4, 431, 4, 1),
(2, 5, 142, 3, 15),
(2, 6, 400, 4, 5),
(2, 7, 556, 5, 9),
(2, 8, 347, 4, 17),
(2, 9, 398, 4, 3),
(2, 10, 210, 3, 16),
(2, 11, 511, 5, 6),
(2, 12, 147, 3, 18),
(2, 13, 397, 4, 14),
(2, 14, 358, 4, 12),
(2, 15, 297, 4, 8),
(2, 16, 535, 5, 2),
(2, 17, 381, 4, 10),
(2, 18, 413, 4, 4);


-- Insert holes for White tee
INSERT INTO holes (tee_id, hole_number, yardage, par, handicap) VALUES 
(3, 1, 356, 4, 11),
(3, 2, 190, 3, 13),
(3, 3, 512, 5, 7),
(3, 4, 405, 4, 1),
(3, 5, 131, 3, 15),
(3, 6, 367, 4, 5),
(3, 7, 539, 5, 9),
(3, 8, 318, 4, 17),
(3, 9, 368, 4, 3),
(3, 10, 175, 3, 16),
(3, 11, 498, 5, 6),
(3, 12, 127, 3, 18),
(3, 13, 360, 4, 14),
(3, 14, 340, 4, 12),
(3, 15, 281, 4, 8),
(3, 16, 520, 5, 2),
(3, 17, 354, 4, 10),
(3, 18, 383, 4, 4);

-- ROUND 2 -----------------------------------------------------------------
-- Insert holes for Yellow tee
INSERT INTO holes (tee_id, hole_number, yardage, par, handicap) VALUES 
(4, 1, 432, 4, 15),
(4, 2, 556, 5, 7),
(4, 3, 195, 3, 17),
(4, 4, 439, 4, 5),
(4, 5, 347, 4, 13),
(4, 6, 468, 4, 1),
(4, 7, 563, 5, 3),
(4, 8, 158, 3, 11),
(4, 9, 404, 4, 9),
(4, 10, 534, 5, 10),
(4, 11, 164, 3, 16),
(4, 12, 432, 4, 2),
(4, 13, 304, 4, 14),
(4, 14, 433, 4, 4),
(4, 15, 191, 3, 8),
(4, 16, 355, 4, 18),
(4, 17, 493, 5, 12),
(4, 18, 425, 4, 6);

-- Insert holes for Green tee
INSERT INTO holes (tee_id, hole_number, yardage, par, handicap) VALUES 
(5, 1, 414, 4, 15),
(5, 2, 545, 5, 7),
(5, 3, 182, 3, 17),
(5, 4, 429, 4, 5),
(5, 5, 306, 4, 13),
(5, 6, 442, 4, 1),
(5, 7, 537, 5, 3),
(5, 8, 141, 3, 11),
(5, 9, 374, 4, 9),
(5, 10, 513, 5, 10),
(5, 11, 154, 3, 16),
(5, 12, 372, 4, 2),
(5, 13, 261, 4, 14),
(5, 14, 411, 4, 4),
(5, 15, 158, 3, 8),
(5, 16, 345, 4, 18),
(5, 17, 466, 5, 12),
(5, 18, 412, 4, 6);

-- Insert holes for Combo tee
INSERT INTO holes (tee_id, hole_number, yardage, par, handicap) VALUES 
(6, 1, 371, 4, 15),
(6, 2, 545, 5, 7),
(6, 3, 134, 3, 17),
(6, 4, 344, 4, 5),
(6, 5, 306, 4, 13),
(6, 6, 354, 4, 1),
(6, 7, 537, 5, 3),
(6, 8, 141, 3, 11),
(6, 9, 317, 4, 9),
(6, 10, 513, 5, 10),
(6, 11, 154, 3, 16),
(6, 12, 294, 4, 2),
(6, 13, 261, 4, 14),
(6, 14, 333, 4, 4),
(6, 15, 158, 3, 8),
(6, 16, 345, 4, 18),
(6, 17, 415, 5, 12),
(6, 18, 412, 4, 6);

-- SCRAMBLE -----------------------------------------------------------------
-- Insert holes for Yellow tee
INSERT INTO holes (tee_id, hole_number, yardage, par, handicap) VALUES 
(7, 1, 432, 4, 15),
(7, 2, 556, 5, 7),
(7, 3, 195, 3, 17),
(7, 4, 439, 4, 5),
(7, 5, 347, 4, 13),
(7, 6, 468, 4, 1),
(7, 7, 563, 5, 3),
(7, 8, 158, 3, 11),
(7, 9, 404, 4, 9),
(7, 10, 534, 5, 10),
(7, 11, 164, 3, 16),
(7, 12, 432, 4, 2),
(7, 13, 304, 4, 14),
(7, 14, 433, 4, 4),
(7, 15, 191, 3, 8),
(7, 16, 355, 4, 18),
(7, 17, 493, 5, 12),
(7, 18, 425, 4, 6);

-- Insert holes for Green tee
INSERT INTO holes (tee_id, hole_number, yardage, par, handicap) VALUES 
(8, 1, 414, 4, 15),
(8, 2, 545, 5, 7),
(8, 3, 182, 3, 17),
(8, 4, 429, 4, 5),
(8, 5, 306, 4, 13),
(8, 6, 442, 4, 1),
(8, 7, 537, 5, 3),
(8, 8, 141, 3, 11),
(8, 9, 374, 4, 9),
(8, 10, 513, 5, 10),
(8, 11, 154, 3, 16),
(8, 12, 372, 4, 2),
(8, 13, 261, 4, 14),
(8, 14, 411, 4, 4),
(8, 15, 158, 3, 8),
(8, 16, 345, 4, 18),
(8, 17, 466, 5, 12),
(8, 18, 412, 4, 6);

-- Insert holes for Combo tee
INSERT INTO holes (tee_id, hole_number, yardage, par, handicap) VALUES 
(9, 1, 371, 4, 15),
(9, 2, 545, 5, 7),
(9, 3, 134, 3, 17),
(9, 4, 344, 4, 5),
(9, 5, 306, 4, 13),
(9, 6, 354, 4, 1),
(9, 7, 537, 5, 3),
(9, 8, 141, 3, 11),
(9, 9, 317, 4, 9),
(9, 10, 513, 5, 10),
(9, 11, 154, 3, 16),
(9, 12, 294, 4, 2),
(9, 13, 261, 4, 14),
(9, 14, 333, 4, 4),
(9, 15, 158, 3, 8),
(9, 16, 345, 4, 18),
(9, 17, 415, 5, 12),
(9, 18, 412, 4, 6);

INSERT INTO teams (team_name) VALUES
('Team 1'),
('Team 2'),
('Team 3');

INSERT INTO team_members (team_id, user_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(3, 9),
(3, 10),
(3, 11),
(3, 12);

INSERT INTO historical_scores(user_id, year, round1score, round2score, handicap, round1handicap, round2handicap) VALUES
--Todd
(1, 2020, 106, 81, 17, 18, 18),
(1, 2021, 99, 85, 19, 17, 17),
(1, 2022, 94, 96, 19, 16, 16),
(1, 2023, 96, 98, 19, 19, 17),
--Brett
(2, 2020, 82, 80, 12, 11, 11),
(2, 2023, 101, 89, 12,  12, 10),
--Lawson

--Darren

--Daniel
(5, 2023, 91, 93, 19, 21, 18),
--John

--Todd Fanter
(7, 2023, 105, 124, 28, 31, 28),
--Shane
(8, 2023, 110, 102, 29, 26, 24),
--Caleb
(9, 2023, 106, 95, 19, 20, 18),
--Tyson
(10, 2023, 104, 98, 23, 24, 22),
--David
(11, 2023, 110, 114, 24, 26, 24),
--Isaac
(12, 2023, 106, 107, 17, 18, 16),
--Matt
(13, 2023, 98, 93, 21, 23, 21)
