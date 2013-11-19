module.exports = 
  { "development":
    { "driver":   "mongodb",
	  "url": "mongodb://nam:nam@paulo.mongohq.com:10063/automarket"
    }
  , "test":
    { "driver":   "memory"
    }
  , "production":
    { "driver":   "memory"
    }
  };
