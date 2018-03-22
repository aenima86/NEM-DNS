var nem = require("nem-sdk").default;


// from url
var urls = getParameterByName('url');


if(urls !== null){


 	var namespace = urls.replace(/.nem/g, '');
	var namRequest = "http://104.128.226.60:7890/namespace?namespace=" + namespace;
	
	var pointerAcc = getPointerAccount(namespace);

	console.log( "namRequest:"+namRequest );

	getNamespaceOwner(namRequest,namespace,1,pointerAcc);

} 



// from button request 
// redirect to ip
$("#goBut").click(function(){
	
	var namespace = $('#inputName').val().replace(/.nem/g, '');

	var namRequest = "http://104.128.226.60:7890/namespace?namespace=" + namespace;

	var pointerAcc = getPointerAccount(namespace);

	console.log( "namRequest:"+namRequest );

	getNamespaceOwner(namRequest,namespace,1,pointerAcc);


});

// from button request 
// get info
$("#getBut").click(function(){
	
	var namespace = $('#inputName').val().replace(/.nem/g, '');
	
	var namRequest = "http://104.128.226.60:7890/namespace?namespace=" + namespace;
	
	var pointerAcc = getPointerAccount(namespace);
	
	console.log( "namRequest:"+namRequest );
	
	getNamespaceOwner(namRequest,namespace,2,pointerAcc);
	
});



function getNamespaceOwner(namRequest,namespace,typeRe,pointerAcc) {


	var jqxhr = $.getJSON( namRequest, function() {
	  })
		.done(function(data) {
		  

		  ownerAdd = data['owner'];
		  console.log( "Owner:"+ownerAdd );
			console.log( "PointerAcc:"+pointerAcc );

		 getDNSdata(ownerAdd,namespace,typeRe,pointerAcc) ;


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


function getDNSdata(ownerAdd,namespace,typeRe,pointerAcc) {

	var dataRequest = "http://104.128.226.60:7890/account/transfers/incoming?address="+pointerAcc;
	
	
		var jqxhr = $.getJSON( dataRequest, function() {

		  })
			.done(function(data) {
	
			  var stop =0;

			  $.each(data['data'], function( index, value ) {

					
					if ( nem.model.address.toAddress(value['transaction']['signer'], nem.model.network.data.testnet.id)== ownerAdd){
						

						var payload = convertFromHex(value['transaction']['message']['payload']);
						var objPayload = jQuery.parseJSON( payload );
						if (objPayload['dns']=='yes' && stop==0){

							stop =1;

							if(typeRe==1){window.location ='http://'+objPayload['ip1']};
							if(typeRe==2){alert(payload);};

						}

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

function getPointerAccount(namespace){

	passphrase = sha256(namespace);
	
	var privateKey =  nem.crypto.helpers.derivePassSha(passphrase, 6000).priv;
	
	var keyPair = nem.crypto.keyPair.create(privateKey);
	
	var publicKey = keyPair.publicKey.toString();
	
	var address = nem.model.address.toAddress(publicKey, nem.model.network.data.testnet.id);
	
	return address;

}


// finding namespace pointer address (PA)
$("#goPA").click(function(){
	
	findPA();

});

function findPA() {
	var namespace = prompt("Please enter your namespace (e.g. 'helloworld'", "MyNameSpace");
	if (namespace != null) {
			alert("The pointer address for " +namespace +" is " +getPointerAccount(namespace));
	}
}
