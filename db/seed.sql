-- Seed the 'The Ledges of St George' course
INSERT INTO courses (course_name, address) VALUES 
('The Ledges of St George', 'St. George, Utah');

INSERT INTO rounds (course_id, date) VALUES
(1, '2024-05-13'), 
-- (1, '2024-05-14'); 

-- Insert tees for 'The Ledges of St George'
INSERT INTO tees (course_id, tee_name, color) VALUES 
(1, 'Black', 'Black'),
(1, 'Blue', 'Blue'),
(1, 'White', 'White'),

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
(3, 5, 131, 3 15),
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
