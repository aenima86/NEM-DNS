# **NEM DNS**
![alt text](https://i.imgur.com/ODSWGpR.png "NEM DNS")

This blog post will demonstrate how the NEM blockchain can be used for a smart, decentralized and reliable DNS service for internet services, for example the translation of domain names to IP addresses. The project include
* MIT licensed github code
* Translation of domaine name to IP addresses
* Chrome extension for fast searching .nem domains using the browser address bar
* Domain name lookup of associated information
* Demonstration of easy updatable records for the .nem domain owner 

### What is DNS
The Domain Name System (DNS) is a hierarchical naming system for computers, services, or other resources connected to the Internet or a private network. It associates various information with domain names assigned to each of the participating entities. Most prominently, it translates more readily memorized domain names to the numerical IP addresses needed for locating and identifying computer services and devices with the underlying network protocols. By providing a worldwide, distributed directory service, the Domain Name System is an essential component of the functionality on the Internet, that has been in use since 1985.

### Why do we need a blockchain DNS
The classic DNS system despite its high performance, has many weaknesses. The classic DNS system is vanuable for attacks. For instance, an attacker can hack it and then forward your traffic to fake websites by hijacking DNS responses for intermediate caching servers. In many parts of the world, authorties are sensoring and blocking domains for more or less righteous reasons. The price for owning / maintaing a domain name can be costly and the speed of updating domain records is slow.

NEM is a peer-to-peer network that has no domain registrars, domain zone owners, or intermediate caches. The NEM blockchain has proven to be one of the most secure blockchains and information cannot be tampered with. Each NIS has a validated copy of the entire blockchain , the complete database of domainnames, messages and transactions. Data reliability is based on the fact that the database is the same for all NIS ensured by the blockchain technology itself and a public consensus mechanisme. Noone, except the owner of each private key, can change or cancel any record in the chain after it has been submittet and validated. 

### Controlling a namespace
The owner of a NEM namespace can use the NEM DNS in a few easy setps. The DNS is build around the namespace platform in the NEM ecosystem and associated mosaics. The owner needs to create a mosaic with the name "dns". The mosaic can now be send to the same address owning the namespace including a non-encrypted message in json format with information related to the namespace. The message can include relevant information such as IP address, ownership info, physical address, contact info and much more. To update the record the owner can simply resend the "dns" mosaic with the new information.   

##### Example of JSON object: 
```json
 {"ip":"your ip", "email": "your email" ...}
``` 

![alt text](https://i.imgur.com/F7TZubA.jpg "NEM DNS website")

### Searching the DNS
Searching the DNS can be done in several ways, this project have made aviable two different options. (1) using a website, (2) a chrome extension for easy search using the browser adressbar. Both options uses javascript and the utilities of the NIS api. When requesting a search for the .nem domain name the algorithm will do two NIS requests, the first one will establish ownership of the domain.

##### Example: 
http://104.128.226.60:7890/namespace?namespace=blockchain

 
##### Example of returned JSON object: 
```json
{"owner":"TBP6ZYBVNRA7S6EOQZ45IXNN3UJTABR3ONKJJSQK","fqn":"blockchain","height":1206887}
``` 

When ownership of the domain is established the algortihme will do a second request related to the owner account. This request will look for outgoing transactions from the account. Looping thought the transactions searching for the newest "dns" mosaic transaction with DNS information.

##### Example: 
http://104.128.226.60:7890/account/transfers/outgoing?address=TBP6ZYBVNRA7S6EOQZ45IXNN3UJTABR3ONKJJSQK

```js
$.each(data['data'], function( index, value ) {

	if (value['transaction']['mosaics']!= undefined){

	    $.each(value['transaction']['mosaics'], function( index2, value2 ) {
	    
			if (value2['mosaicId']['namespaceId'] == namespace && ...
			value2['mosaicId']['name'] == 'dns'){

				var payload = convertFromHex(value['transaction']['message']['payload']);
				var objPayload = jQuery.parseJSON( payload );
				if(typeRequest==1){window.location ='http://'+objPayload['ip1']};
			}
		});
	}
 });
```
 
Code from this project is aviable via github under MIT license. The website demo is pulling code from github and you can try it from here: DEMO.
You can also try the chrome extention by manually installing it. You will have to navigate to the chrome extentions page  [chrome://extensions](chrome://extensions) (copy past this into your chrome browser), activate developer mode, download the NEM DNS chrome extension from the github page and then load unpacked extension from google chrome. Now a NEM icon should appear in the right corner of the browser and you are ready to search NEM domains. You can try navigating to "blockchain.nem".

 
 
