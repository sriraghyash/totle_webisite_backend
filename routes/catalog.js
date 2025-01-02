const express = require('express');
const router = express.Router();
const { Category, Education, Board, Grade, Subject, Topic } = require('../models/catalogModels');

router.get('/', async (req, res) => {
    try {
        const { category, education, board, grade, subject, topic } = req.query;

        if (!category) {
            // Fetch categories
            const categories = await Category.findAll();
            return res.json(categories.map(category => ({
                id: category.id,
                name: category.name,
                description: category.description || null,
            })));
        } else if (category && !education) {
            // Fetch educations and include parent category
            const educations = await Education.findAll({
                where: { categoryId: category },
                include: {
                    model: Category,
                    attributes: ['id', 'name', 'description'],
                },
            });

            return res.json(educations.map(education => ({
                id: education.id,
                name: education.name,
                description: education.description || null,
                parent: {
                    id: education.Category.id,
                    name: education.Category.name,
                    description: education.Category.description || null,
                },
            })));
        } else if (education && !board) {
            // Fetch boards and include parent education
            const boards = await Board.findAll({
                where: { educationId: education },
                include: {
                    model: Education,
                    attributes: ['id', 'name', 'description'],
                    include: {
                        model: Category,
                        attributes: ['id', 'name', 'description'],
                    },
                },
            });

            return res.json(boards.map(board => ({
                id: board.id,
                name: board.name,
                description: board.description || null,
                parent: {
                    id: board.Education.id,
                    name: board.Education.name,
                    description: board.Education.description || null,
                    parent: {
                        id: board.Education.Category.id,
                        name: board.Education.Category.name,
                        description: board.Education.Category.description || null,
                    },
                },
            })));
        } else if (board && !grade) {
            // Fetch grades and include parent board
            const grades = await Grade.findAll({
                where: { boardId: board },
                include: {
                    model: Board,
                    attributes: ['id', 'name', 'description'],
                    include: {
                        model: Education,
                        attributes: ['id', 'name', 'description'],
                        include: {
                            model: Category,
                            attributes: ['id', 'name', 'description'],
                        },
                    },
                },
            });

            return res.json(grades.map(grade => ({
                id: grade.id,
                name: grade.name,
                description: grade.description || null,
                parent: {
                    id: grade.Board.id,
                    name: grade.Board.name,
                    description: grade.Board.description || null,
                    parent: {
                        id: grade.Board.Education.id,
                        name: grade.Board.Education.name,
                        description: grade.Board.Education.description || null,
                        parent: {
                            id: grade.Board.Education.Category.id,
                            name: grade.Board.Education.Category.name,
                            description: grade.Board.Education.Category.description || null,
                        },
                    },
                },
            })));
        } else if (grade && !subject) {
            // Fetch subjects and include parent grade
            const subjects = await Subject.findAll({
                where: { gradeId: grade },
                include: {
                    model: Grade,
                    attributes: ['id', 'name', 'description'],
                    include: {
                        model: Board,
                        attributes: ['id', 'name', 'description'],
                        include: {
                            model: Education,
                            attributes: ['id', 'name', 'description'],
                            include: {
                                model: Category,
                                attributes: ['id', 'name', 'description'],
                            },
                        },
                    },
                },
            });

            return res.json(subjects.map(subject => ({
                id: subject.id,
                name: subject.name,
                description: subject.description || null,
                parent: {
                    id: subject.Grade.id,
                    name: subject.Grade.name,
                    description: subject.Grade.description || null,
                    parent: {
                        id: subject.Grade.Board.id,
                        name: subject.Grade.Board.name,
                        description: subject.Grade.Board.description || null,
                        parent: {
                            id: subject.Grade.Board.Education.id,
                            name: subject.Grade.Board.Education.name,
                            description: subject.Grade.Board.Education.description || null,
                            parent: {
                                id: subject.Grade.Board.Education.Category.id,
                                name: subject.Grade.Board.Education.Category.name,
                                description: subject.Grade.Board.Education.Category.description || null,
                            },
                        },
                    },
                },
            })));
        } else if (subject && !topic) {
            // Fetch topics and include parent subject
            const topics = await Topic.findAll({
                where: { subjectId: subject },
                include: {
                    model: Subject,
                    attributes: ['id', 'name', 'description'],
                    include: {
                        model: Grade,
                        attributes: ['id', 'name', 'description'],
                        include: {
                            model: Board,
                            attributes: ['id', 'name', 'description'],
                            include: {
                                model: Education,
                                attributes: ['id', 'name', 'description'],
                                include: {
                                    model: Category,
                                    attributes: ['id', 'name', 'description'],
                                },
                            },
                        },
                    },
                },
            });

            return res.json(topics.map(topic => ({
                id: topic.id,
                name: topic.name,
                description: topic.description || null,
                parent: {
                    id: topic.Subject.id,
                    name: topic.Subject.name,
                    description: topic.Subject.description || null,
                    parent: {
                        id: topic.Subject.Grade.id,
                        name: topic.Subject.Grade.name,
                        description: topic.Subject.Grade.description || null,
                        parent: {
                            id: topic.Subject.Grade.Board.id,
                            name: topic.Subject.Grade.Board.name,
                            description: topic.Subject.Grade.Board.description || null,
                            parent: {
                                id: topic.Subject.Grade.Board.Education.id,
                                name: topic.Subject.Grade.Board.Education.name,
                                description: topic.Subject.Grade.Board.Education.description || null,
                                parent: {
                                    id: topic.Subject.Grade.Board.Education.Category.id,
                                    name: topic.Subject.Grade.Board.Education.Category.name,
                                    description: topic.Subject.Grade.Board.Education.Category.description || null,
                                },
                            },
                        },
                    },
                },
            })));
        } else {
            return res.status(400).json({ error: 'Invalid query parameters' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
