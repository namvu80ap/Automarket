module.exports = 
  { "development":
    { "driver":   "mongodb",
      "host": "localhost",
      "port": "27017",
      "database": "automarket"
    }
  , "test":
    { "driver":   "memory"
    }
  , "production":
    { "driver":   "memory"
    }
  };
