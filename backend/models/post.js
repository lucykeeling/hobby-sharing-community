const addPost = async (req, res) => {
        const { title, content, category, media } = req.body;
        try {
            const newPost = await Post.create({ userId: req.user.id, title, content, category, media });
            res.status(201).json(newPost);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
