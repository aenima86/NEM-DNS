var urls = getParameterByName('url');


if(urls !== null){


 	var namespace = urls.replace(/.nem/g, '');
	var namRequest = "http://104.128.226.60:7890/namespace?namespace=" + namespace;
	
	getNamespaceOwner(namRequest,namespace,1);

}




$("#goBut").click(function(){
	
	var namespace = $('#inputName').val().replace(/.nem/g, '');
	

	var namRequest = "http://104.128.226.60:7890/namespace?namespace=" + namespace;

	console.log( "namRequest:"+namRequest );

	getNamespaceOwner(namRequest,namespace,1);



});

$("#getBut").click(function(){
	
	var namespace = $('#inputName').val().replace(/.nem/g, '');

	var namRequest = "http://104.128.226.60:7890/namespace?namespace=" + namespace;

	console.log( "namRequest:"+namRequest );

	getNamespaceOwner(namRequest,namespace,2);
	
});


function getNamespaceOwner(namRequest,namespace,typeRe) {


	var jqxhr = $.getJSON( namRequest, function() {
	  })
		.done(function(data) {
		  

		  ownerAdd = data['owner'];
		  console.log( "Owner:"+ownerAdd );

		  getDNSdata(ownerAdd,namespace,typeRe) ;


		})
		.fail(function() {
		  console.log( "error" );
		})
		.always(function() {
		  console.log( "complete" );
		});
	   
	   
	  // Set another completion function for the request above
	  jqxhr.complete(function() {
		
	  });
	
    
};


function getDNSdata(ownerAdd,namespace,typeRe) {

	var dataRequest = "http://104.128.226.60:7890/account/transfers/outgoing?address="+ownerAdd;
	
	
		var jqxhr = $.getJSON( dataRequest, function() {

		  })
			.done(function(data) {
	
			  

			  $.each(data['data'], function( index, value ) {
				

					if (value['transaction']['mosaics']!= undefined){

						$.each(value['transaction']['mosaics'], function( index2, value2 ) {

							
							if (value2['mosaicId']['namespaceId'] == namespace && value2['mosaicId']['name'] == 'dns'){

								var payload = convertFromHex(value['transaction']['message']['payload']);
								console.log(payload);
								var objPayload = jQuery.parseJSON( payload );
								console.log(objPayload['ip1']);

								if(typeRe==1){window.location ='http://'+objPayload['ip1']};
								if(typeRe==2){alert(payload);};
								
								
								


							}

						});

					}
					

			  });
	
	
			})
			.fail(function() {
			  console.log( "error" );
			})
			.always(function() {
			  console.log( "complete" );
			});
		   
		   
		  // Set another completion function for the request above
		  jqxhr.complete(function() {
		  });
		
		
	};

function convertFromHex(hex) {
		var hex = hex.toString();//force conversion
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
