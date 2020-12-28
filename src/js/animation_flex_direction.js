const gsap = require('gsap').gsap
const Power1 = require('gsap').Power1

module.exports.AnimationFlex = function (statusFrameChat) {
    var container = document.querySelector(".videos");
		var group = document.querySelector(".not-gim-layout");
		var nodes = document.querySelectorAll(".box-video");
		var total = nodes.length;
		var ease  = Power1.easeInOut;
		var boxes = [];

		for (var i = 0; i < total; i++) {
		    
		  var node = nodes[i];
		  
		  // Initialize transforms on node
		  gsap.set(node, { x: 0 });
		   
		  boxes[i] = {
		    transform: gsap.getProperty(node),
		    x: node.offsetLeft,
		    y: node.offsetTop,
		    node    
		  };
		} 
    if(statusFrameChat){
      container.classList.add("reorder-container");  
      group.classList.add("reorder"); 
      nodes.forEach(element => {
        element.style.height = '80%'
        element.style.flex = '1'
      })
    }else{
      container.classList.remove("reorder-container");
      group.classList.remove("reorder"); 
      nodes.forEach(element => {
        element.removeAttribute("style")
      })  
    }
     
    for (var i = 0; i < total; i++) {
    
    var box = boxes[i];
        
    var lastX = box.x;
    var lastY = box.y;   
    
    box.x = box.node.offsetLeft;
    box.y = box.node.offsetTop;
    
    // Continue if box hasn't moved
    if (lastX === box.x && lastY === box.y) continue;
    
    // Reversed delta values taking into account current transforms
    var x = box.transform("x") + lastX - box.x;
    var y = box.transform("y") + lastY - box.y;  
    
    // Tween to 0 to remove the transforms
    gsap.fromTo(box.node, 1, { x, y }, { x: 0, y: 0, ease });    
    } 
}  