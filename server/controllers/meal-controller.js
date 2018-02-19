let Meal = require('../models/meal/meal');
let User = require('../models/user/user');
let Group = require('../models/group/group');
let Message = require('../models/message/message');
let moment = require('moment');
let dateHelper = require('../services/date-helper');


        .then(meal => {
module.exports.get = function(req, res) {
	let id = req.params.id;

	Meal.findById(id)
		.populate('cook')
		.populate('participants')
		.exec()
		.then(meal => {
			res.send(meal);
		});
};



			Meal.getList(userGroups, meals => {
				res.send(meals);
			});
};

};

};


	}

};

};

};

};
