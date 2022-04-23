// see if we can make two arrays equal by assignment
//
var params = [];
var startWith = 0;
var endWith = 24;

params[0] = {
    'started':startWith,
    'endWith': endWith
    };

    params[1] = {
        'started':startWith,
        'endWith': endWith
        };
        params[2] = params[0];

        console.log(params)