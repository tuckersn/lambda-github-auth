const axios = require('axios')


async function refreshToken(token) {

	return new Promise( (res, err) => {
		axios.post('https://oauth2.googleapis.com/token', {
			refresh_token: token,
			client_id: process.env.client_id,
			client_secret: process.env.client_secret,
			grant_type: "refresh_token"
		}).then( response => {
			res(response.data)
		})
	})

}


exports.handler = async (event) => {
	
	
	let response = {
		statusCode: 200,
		body: {},
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			"Access-Control-Allow-Credentials" : true
		}
	};
	

	
	

	try {
		if( event.requestContext.httpMethod == "OPTIONS" ) {
			
	
			if(event.headers !== null) {
				response["body"] = { 
					token: "OH NO"
				}
			}
		
			
		} else {	
			if(event.body !== null) {
				event.body = JSON.parse(event.body)
				if("token" in event.body) {
					response["body"] = { 
						token: await refreshToken(event.body.token)
					}
				} else {
					response["body"] = {
						"error": "token was not provided in body"
					}
				}
			} else {
				response["body"] = {
					"error": "a body was not provided"
				}
			}
		}
		
		
		response["body"] = typeof response["body"] === 'object' ? JSON.stringify(response["body"]) : response["body"]
		
		
	} catch(e) {
		console.error(e)
	}
	
	return response;


};
