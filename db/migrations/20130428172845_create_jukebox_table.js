var create_jukebox_table = new Migration({
    up: function () {
        "use strict";

        this.execute('PRAGMA foreign_keys = ON;');

        this.execute("CREATE TABLE jukeboxes (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "name INTEGER NOT NULL, " +
            "address VARCHAR, " +
            "city VARCHAR, " +
            "state VARCHAR, " +
            "postalCode VARCHAR, " +
            "locationLat DECIMAL NOT NULL, " +
            "locationLong DECIMAL NOT NULL, " +
            "password VARCHAR NOT NULL, " +
            "clientPassword VARCHAR NOT NULL, " +
            "masterVolumeLevel INTEGER NOT NULL DEFAULT 0, " +
            "maxQueuesPerClient INTEGER NOT NULL DEFAULT 0, " +
            "maxQueueLength INTEGER NOT NULL DEFAULT 0, " +
            "crossFadeTracks BOOLEAN NOT NULL DEFAULT true, " +
            "createdAt DATETIME, " +
            "updatedAt DATETIME)");
    },
    down: function () {
        "use strict";

        this.drop_table('jukeboxes');
        this.execute('PRAGMA foreign_keys = OFF;');
    }
});