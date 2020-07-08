
inputHeader.addEventListener("keypress",function(keyPressed){
  if(keyPressed.which === 13){
    if ( editItemId ) {
      console.log(1)
    } else {
      document.title = keyPressed.path[0].value
      sessionStorage.setItem('info', JSON.stringify(keyPressed.path[0].value))
    }  
  }      
});

ul.addEventListener("keypress",function(keyPressed){
  if(keyPressed.which === 13 && editItemId ){
    let value = document.getElementById("editElementInput").value
    if(value){
      elementValueUpdate(value)
    }
    editItemId = null
    watchToDoList();  
  }    
  console.log(keyPressed.which)
});
ul.addEventListener('click', function(ev) {
    
  if(String(ev.target.type) == "checkbox") {
    const listCounter = (indexes, elements) => {
      console.log(elements)
      let tempElements 
      if (indexes.length === 1) {
        elements[Number(indexes[0])].checked = !elements[Number(indexes[0])].checked
        return elements
      } else {
        tempElements = [
          ...elements.splice(0, indexes[0]),
          { 
            value: elements[0].value, 
            checked: elements[0].checked, 
            childs:listCounter(indexes.slice(1), elements[0].childs)
          },
          ...elements.slice(1)
        ]
      }
      return tempElements
    }
    var tempArrayOfIndexes = ev.target.id.split("_")
    tempArrayOfIndexes = tempArrayOfIndexes.filter( item => item != "")
    listOfElements = listCounter(tempArrayOfIndexes, listOfElements)
    watchToDoList()
  }
  if(String(ev.target.tagName) == "I") {
    if(ev.path[1].id === "append") {
      editItemId = ev.path[2].id + "_" + 0
      var tempArrayOfIndexes = ev.path[2].id.split("_")
      tempArrayOfIndexes = tempArrayOfIndexes.filter( item => item != "")
      listOfElements = elementAppend(tempArrayOfIndexes, listOfElements)
      console.log(listOfElements)
      watchToDoList()
    } else if ( ev.path[1].id === "delete" ) {
      var tempArrayOfIndexes = ev.path[2].id.split("_")
      tempArrayOfIndexes = tempArrayOfIndexes.filter( item => item != "")
      listOfElements = elementDelete(tempArrayOfIndexes, listOfElements)
      watchToDoList()
    } else if ( ev.path[1].id === "edit" ) {
      editItemId = (ev.path[2].id)
      watchToDoList()
    }
  }

},false
);


var DragManager = new function() {
  var dragObject = {};

  var self = this;

  function onMouseDown(e) {
    if (e.target.tagName !== "LI") return;
    if (e.which != 1) return;

    var elem = e.target.closest('li');
    if (!elem) return;

    dragObject.elem = elem;
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;

    return false;
  }

  function onMouseMove(e) {
    if (!dragObject.elem) return;
    if (!dragObject.avatar) {
      var moveX = e.pageX - dragObject.downX;
      var moveY = e.pageY - dragObject.downY;
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }
      dragObject.avatar = createAvatar(e); 
      if (!dragObject.avatar) { 
        dragObject = {};
        return;
      }
      var coords = getCoords(dragObject.avatar);
      dragObject.shiftX = dragObject.downX - coords.left;
      dragObject.shiftY = dragObject.downY - coords.top;

      startDrag(e); 
    }
    dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

    return false;
  }

  function onMouseUp(e) {
    if (dragObject.avatar) {
      finishDrag(e);
    }
    dragObject = {};
  }

  function finishDrag(e) {
    var dropElem = findDropPoint(e);
    if (!dropElem) {
      self.onDragCancel(dragObject);
    } else {
      self.onDragEnd(dragObject, dropElem);
    }
  }

  function createAvatar(e) {
    var avatar = dragObject.elem;
    var old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || ''
    };
    avatar.rollback = function() {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex
    };

