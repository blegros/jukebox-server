var create_tracks_table = new Migration({
	up: function() {
        "use strict";

        //execute SQL directly since FKs can only be create on table create in sqlite3
        this.execute("CREATE TABLE tracks (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "jukeboxId INTEGER, " +
            "trackId TEXT NOT NULL, " +
            "trackPlayTimestamp DATETIME, " +
            "votesFor INTEGER NOT NULL DEFAULT 0, " +
            "votesAgainst INTEGER NOT NULL DEFAULT 0, " +
            "createdAt DATETIME, " +
            "updatedAt DATETIME, " +
            "FOREIGN KEY(jukeboxId) REFERENCES jukeboxes(id)" +
            ");");
	},
	down: function() {
        "use strict";

        this.drop_table('tracks');
	}
});