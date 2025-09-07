import pool from '../config/db.js';

export const getUserData = async(req, res) => {
    try{
        const {userId} = req.body;
        const user = await pool.query('SELECT name, surname, username, "isAccountVerified", email FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        const followers = await pool.query('SELECT f.follower_id, u.name, u.surname, u.username FROM cfgvault."FOLLOWERS" f JOIN cfgvault."USERS" u ON f.follower_id = u.user_id WHERE f.user_id = $1', [userId]);

        if(user.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        res.json({
            success: true,
            userData: {
                name: user.rows[0].name,
                surname: user.rows[0].surname,
                username: user.rows[0].username,
                isAccountVerified: user.rows[0].isAccountVerified,
                email: user.rows[0].email,
                followers: followers.rows.length === 0 ? '' : followers.rows
            }
        });
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getUserProfile = async(req, res) => {
    try{
        const {userId} = req.body;
        const {username} = req.params;
        const user = await pool.query('SELECT user_id, name, surname, username, likes FROM cfgvault."USERS" WHERE username = $1', [username]);
        const followingStatus = await pool.query('SELECT follower_id FROM cfgvault."FOLLOWERS" WHERE user_id = $1 AND follower_id = $2', [userId, user.rows[0].user_id]);
        const followingCount = await pool.query('SELECT COUNT(follower_id) AS following FROM cfgvault."FOLLOWERS" WHERE user_id = $1', [user.rows[0].user_id]);
        const followersCount = await pool.query('SELECT COUNT(follower_id) AS followers FROM cfgvault."FOLLOWERS" WHERE follower_id = $1', [user.rows[0].user_id]);

        if(user.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        res.json({
            success: true,
            userData: {
                userId: user.rows[0].user_id,
                name: user.rows[0].name,
                surname: user.rows[0].surname,
                username: user.rows[0].username,
                followingStatus: followingStatus.rows.length === 0 ? false : true,
                followingCount: followingCount.rows.length === 0 ? '0' : followingCount.rows,
                followersCount: followersCount.rows.length === 0 ? '0' : followersCount.rows,
                likes: user.rows[0].likes
            },
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getAllUsers = async(req, res) => {
    try{
        const users = await pool.query('SELECT username FROM cfgvault."USERS"');
        if(users.rows.length === 0){
            return res.json({success: false, message: "No users found"});
        }

        res.json({
            success: true,
            users: users.rows
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const addFollower = async(req, res) => {
    try{
        const {userId, followerId} = req.body;
        const user = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        const follower = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [followerId]);

        if(user.rows.length === 0 || follower.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        await pool.query('INSERT INTO cfgvault."FOLLOWERS" (user_id, follower_id) VALUES ($1, $2)', [userId, followerId]);

        res.json({
            success: true,
            message: "Follower added successfully"
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const removeFollower = async(req, res) => {
    try{
        const {userId, followerId} = req.body;
        const user = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        const follower = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [followerId]);

        if(user.rows.length === 0 || follower.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        await pool.query('DELETE FROM cfgvault."FOLLOWERS" WHERE user_id = $1 AND follower_id = $2', [userId, followerId]);

        res.json({
            success: true,
            message: "Follower removed successfully"
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getAllGames = async(req, res) => {
    try{
        const gamesData = await pool.query('SELECT * FROM cfgvault."GAMES"');
        if(gamesData.rows.length === 0){
            return res.json({success: false, message: "No games found"});
        }

        res.json({
            success: true,
            games: gamesData.rows
        });
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getConfigPreset = async(req, res) => {
    try{
        const {game} = req.query;
        const preset = await pool.query('SELECT config_preset FROM cfgvault."GAMES" WHERE name = $1', [game]);
        if(preset.rows.length === 0){
            return res.json({success: false, message: "You need to choose the game!"});
        }
        res.json({
            success: true,
            preset: preset.rows[0].config_preset
        });
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const saveConfig = async(req, res) => {
    try{
        const {userId, configName, gameName, configPreset, visibility} = req.body;
        const user = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        if(user.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        await pool.query('INSERT INTO cfgvault."CONFIGS" (config_name, game_name, settings, visibility, user_id) VALUES ($1, $2, $3, $4, $5)', [configName, gameName, configPreset, visibility, userId]);

        res.json({
            success: true,
            message: "Config saved successfully"
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getOwnConfigs = async(req, res) => {
    try{
        const {userId} = req.body;
        const user = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        if(user.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }
        const configs = await pool.query('SELECT config_id, config_name, game_name, settings, visibility FROM cfgvault."CONFIGS" WHERE user_id = $1', [userId]);
        res.json({
            success: true,
            configs: configs.rows.length === 0 ? '' : configs.rows
        });
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const editConfig = async(req, res) => {
    try{
        const {userId, configId, configName, gameName, configPreset, visibility} = req.body;
        const user = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        if(user.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }
        await pool.query('UPDATE cfgvault."CONFIGS" SET config_name = $1, game_name = $2, settings = $3, visibility = $4 WHERE config_id = $5 AND user_id = $6', [configName, gameName, configPreset, visibility, configId, userId]);
        res.json({
            success: true,
            message: "Config updated successfully"
        });
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const deleteConfig = async(req, res) => {
    try{
        const {userId, configId} = req.body;
        const user = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        if(user.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }
        await pool.query('DELETE FROM cfgvault."CONFIGS" WHERE config_id = $1 AND user_id = $2', [configId, userId]);
        res.json({
            success: true,
            message: "Config deleted successfully"
        });
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getConfigs = async(req, res) => {
    try{
        const {userId, username} = req.body;
        let configs;
        let buttons;
        
        const profileUser = await pool.query('SELECT user_id FROM cfgvault."USERS" WHERE username = $1', [username]);

        if(profileUser.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        if(userId === profileUser.rows[0].user_id){
            configs = await pool.query('SELECT config_id, config_name, game_name, settings, visibility FROM cfgvault."CONFIGS" WHERE user_id = $1', [userId]);
            buttons = true;
        }
        else{
            configs = await pool.query('SELECT config_id, config_name, game_name, settings, visibility FROM cfgvault."CONFIGS" WHERE user_id = $1 AND visibility = $2', [profileUser.rows[0].user_id, 'public']);
            buttons = false;
        }

        res.json({
            success: true,
            configs: configs.rows.length === 0 ? '' : configs.rows,
            buttons: buttons
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const showConfig = async(req, res) => {
    try{
        const {configId} = req.body;
        const config = await pool.query('SELECT config_name, game_name, settings, visibility FROM cfgvault."CONFIGS" WHERE config_id = $1', [configId]);
        if(config.rows.length === 0){
            return res.json({success: false, message: "Config not found"});
        }
        res.json({
            success: true,
            config: config.rows[0]
        });
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}