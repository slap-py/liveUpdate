function httpGet(theUrl,source){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  if(source == true){
      xmlHttp.setRequestHeader('liveUpdate-sendSource','auto-update')
  }else{
      xmlHttp.setRequestHeader('liveUpdate-sendSource','user')
  }
  
  xmlHttp.send( null );
  return xmlHttp.responseText;
}
class liveUpdateError extends Error{
  constructor(message){
      super(message)
      this.name = 'liveUpdateError'
  }
}

const request = function(url,method,hdrs){
  method = method.toUpperCase()
  var request = new XMLHttpRequest()
  
  if(method == "POST"){ 
      request.open("POST",url,false)
  }else if (method == "GET"){
      request.open("GET",url,false)
  }else{
      request.open("GET",url,false)
  }
  for(i=0;i<hdrs.length;i++){
    try{
      header = hdrs[i]
      request.setRequestHeader(header[0],header[1])
    } catch(err){
      try{
        throw new liveUpdateError(`Invalid header, "${header}"`)
    } catch(error){
        console.error(`liveUpdate || ${err.name}, ${err.message}`)
    }
    }
    
  }
  
  request.send(null)
  this.response = request.responseText
  this.json = request.responseXML
  this.url = request.responseURL
  var headers = request.getAllResponseHeaders()
  headers = headers.split('\r\n')
  var headers2 = []
  for(i=0;i<headers.length;i++){
      header = headers[i]
      titles = header.split(': ')[0]
      value = header.split(': ')[1]
      var dict = {}
      if(titles.length < 2){
          
      }else{
          dict[titles] = value
          headers2.push(dict)
      }
      
  }
  for(i=0;i<hdrs.length;i++){
    header = hdrs[i]
    dict = {}
    dict[header[0]] = header[1]
    headers2.push(dict)
  }
  this.headers = headers2
}
const liveUpdate = function(target,url){
  this.url = url || 0
  this.target = url || 0
  this.replacer = 0
  this.interval = 0
  this.intervalMs = 500

  this.addReplacer = function(text){
      this.replacer = text
      
      //fuckery
      if(this.enabled() == true){
          this.end()
          if(document.getElementById(target).innerText.includes(text)){
              //replacer is in text
              var splitted = document.getElementById(target).innerText.split(' ')
              this.startIdx = splitted.indexOf(text)
              tgt = document.getElementById(target).innerText.split(' ')
              var idxo = splitted.indexOf(text)
              if (idxo == -1){
                  try{
                      throw new liveUpdateError("Replacer not found in index.")
                  } catch(error){
                      console.error(`liveUpdate || ${err.name}, ${err.message}`)
                  }
              }else{
                  var starterList = document.getElementById(target).innerText.split(' ')
                  this.starterList = starterList
                  this.interval = setInterval(function(){
                      data = httpGet(url,true)
                      tgt = starterList
                      
                      tgt[splitted.indexOf(text)] = data
                      document.getElementById(target).innerText = this.starter+tgt.join(' ')+this.ender

                  },this.intervalMs)
              }
          }
      }else{
          // add passive listenener to this.start to allow through-easier shit
          
      }
      
      

  }
  this.toggle = function(){
      if(this.interval == 0){
          if(this.replacer == 0){
              this.start()
          }else{
              this.addReplacer()
          }
      }else{
          this.end()
      }
  }
  this.start = function(){
      try{
          
          text=this.replacer
          if(text == "" || text == undefined || text == null){
              if(this.url == 0){
                  throw new liveUpdateError("URL grab target is not defined.")
              }
              if(this.target == 0){
                  throw new liveUpdateError('Target is not defined.')
              }
              this.interval = setInterval(function(){
                  var data = httpGet(url,true)
                  document.getElementById(target).innerText=data
              },this.intervalMs)
          }
          if(document.getElementById(target).innerText.includes(text)){
              //replacer is in text
              var splitted = document.getElementById(target).innerText.split(' ')
              this.startIdx = splitted.indexOf(text)
              tgt = document.getElementById(target).innerText.split(' ')
              var idxo = splitted.indexOf(text)
              if (idxo == -1){
                  try{
                      throw new liveUpdateError("Replacer not found in index.")
                  } catch(error){
                      console.error(`liveUpdate || ${err.name}, ${err.message}`)
                  }
              }else{
                  var starterList = document.getElementById(target).innerText.split(' ')
                  this.starterList = starterList
                  this.interval = setInterval(function(){
                      data = httpGet(url,true)
                      tgt = starterList
                      
                      tgt[idxo] = data
                      document.getElementById(target).innerText =tgt.join(' ')
                  },this.intervalMs)
              }
          }
      }
      catch (err){
          console.error(`liveUpdate || ${err.name}, ${err.message}`)
      }   
  }
  
  this.end = function(){
      try{
          clearInterval(this.interval)
          this.interval = 0
      }catch(err){
          try{
              throw new liveUpdateError("Thread not started.")
          }catch(err){
              console.error(`liveUpdate || ${err.name}, ${err.message}`)
          }
      }
  }
  this.enabled = function(){
      if(this.interval ==0){
          return false
      }else{
          return true
      }
  }
  this.getCurrent = function(){
      return data = httpGet(url,false)
  }
  this.modifyInterval = function(ms){
      if(this.enabled() == true){
          this.end()
          this.intervalMs = ms
          this.start()
      }
  }
}
