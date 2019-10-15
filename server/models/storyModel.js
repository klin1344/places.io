const pool = require('./db');
// coordinate (required) [lat, lng]
// timestamp (required, in UTC) string
// text (optional) string
// image(optional) image


class Story {
    // Story object constructor
    constructor(story) {
        this.coordinate = story.coordinate;
        this.timestamp = story.timestamp;
        this.text = story.text;
        this.image = story.image;
    }

    static createStory(story, result) {
        pool.query("INSERT INTO stories " +
            "(lat, lng, timestamp, text) values " +
            "($1, $2, $3, $4)",
            [story.coordinate[0], story.coordinate[1], story.timestamp, story.text],
            function (err, record) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                } else {
                    result(null, record.insertId);
                }
            });
        // TODO: storing img in S3
    }
}

module.exports = Story;
