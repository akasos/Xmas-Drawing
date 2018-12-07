$(document).ready(function()
{  
  //Buttons
  const addNameBtn = document.querySelector('.add-names');
  const removeNamesBtn = addNameBtn.querySelector('[name=remove-name]');
  const matchUpBtn = addNameBtn.querySelector('[name=match]');
  const reset = addNameBtn.querySelector('[name=resetBtn]');

  //ul and results elements
  const nameList = document.querySelector('.names');
  const results = document.querySelector('.results-wrapper');

  //Where users will be added
  let names = [];

  //Used if you don't want the same inner families from drawing each other
  let familyMode = false;

  //Add users
  function addName(e){
      e.preventDefault();
      //Input value
      const text = (this.querySelector('[name=name')).value;
      text.trim();

      //Family Mode
      if(text.toLowerCase() === 'fam' && names.length === 0) {
          familyMode = true;
          nameList.innerHTML = `<li>Family Mode. Add Names</li>`
          this.reset();
          return;
      }
      
      //Prevents duplicate names from being entered
       if(names.length > 0 && names.some(name => name.text.toLowerCase() === text.toLowerCase())) {
              alert("Cant enter in duplicate names");
              return;
         }


      //Create user
      const name = {
          text: text,
          checked: false,
          family: familyMode ? text.substr(-1).toLowerCase() : ''
      };

      //place user in array
      names.push(name);

      //create the li elements
      populateList(names, nameList);

      //Only enable match up btn with even number of people
      matchUpBtn.disabled = names.length % 2 !== 0 ? true : false; 

      //reset input field.
      console.log(this);
      this.reset();
  }

  //Remove checked users
  function removeNames(e) {
      const uncheckedkNames = names.filter(name => name.checked === false);
      names = [];
      names = [...uncheckedkNames];
      populateList(names, nameList);
  }


  //Match users up
  function matchNames(e) {
      let namesCopy1 = [...names];
      let namesCopy2 = [...names];
      namesCopy1 = shuffle(namesCopy1);
      namesCopy2 = shuffle(namesCopy2);

      if(familyMode === true){

          function isSameFamily(el, index, arr) {
              if (index === 0){
                  return true;
              }
              else {
                  return (el.family === arr[index - 1].family);
              }
          }    

          const matchedArray = [];
          while(namesCopy1.length > 0 && !(namesCopy1.every(isSameFamily)))
          {
              if(namesCopy1[0].family !== namesCopy2[0].family
                  && namesCopy1[namesCopy1.length - 1].text !== namesCopy2[namesCopy2.length - 1].text){
                  const name1 = namesCopy1.shift();
                  const name2 = namesCopy2.shift();                
                  matchedArray.push(name1);
                  matchedArray.push(name2);
              }
              else {
                  shuffle(namesCopy1);
                  shuffle(namesCopy2);
              }
          }

          if(namesCopy1.length > 0){
              console.table(namesCopy1);
              console.table(matchedArray);
             let length = namesCopy1.length;
             for(let i = 0; i < length; i++) {
              while(namesCopy1[0].text === namesCopy2[0].text || namesCopy1[namesCopy1.length - 1].text === namesCopy2[namesCopy2.length -1].text)
              {
                  shuffle(namesCopy1);
                  shuffle(namesCopy2);
              }
              const name1 = namesCopy1.shift()
              const name2 = namesCopy2.shift();                
              matchedArray.push(name1);
              matchedArray.push(name2);
             }
          }
          populateTable(matchedArray);
      }
      else {

          const matchedArray = [];
          //Sort until everyone has been matched up
          while(namesCopy1.length > 0) 
          {
              //Prevent user from matching up with themselves
              if(namesCopy1[0].text !== namesCopy2[0].text && namesCopy1[namesCopy1.length - 1].text !== namesCopy2[namesCopy2.length - 1].text){
                  const name1 = namesCopy1.shift();
                  const name2 = namesCopy2.shift();                
                  matchedArray.push(name1);
                  matchedArray.push(name2);
              }
              else {
                  shuffle(namesCopy1);
                  shuffle(namesCopy2);
              }

          }
          //Print the results.
          populateTable(matchedArray);
      }
  }

  //reset form

  function resetAll() {
      names = [];
      familyMode = false;
      nameList.innerHTML = `<li>Enter 'fam' mode or start entering names.</li>`
      results.innerHTML = '';
      results.style.display = 'none';

  }

  //check and uncheck a users name
  function toggleChecked(e) {
      if(!e.target.matches('input')) return;
      const el = e.target;
      const index = el.dataset.index;
      names[index].checked = !names[index].checked;
      populateList(names, nameList);
  }


  //Add users to the list
  function populateList(names = [], nameList) {
      if(names.length == 0) {
      nameList.innerHTML = `<li>Enter 'fam' mode or start entering names.</li>`;
      return;
      }
      nameList.innerHTML = names.map((name, i) => {
          return `
          <li>
             <span>${i + 1}.</span>
             <input type="checkbox" data-index=${i} id="name${i}" ${name.checked ? 'checked' : ''} />
             <label for="item${i}">${name.text}</label> 
          </li>
          `;
      }).join('');

  }

  //Ouput result table
  function populateTable(matchedArray) {
      results.innerHTML = '';
      let table = document.createElement('table');
      let tr = document.createElement('tr');
      let th = document.createElement('th');
      th.colSpan = 2;
      let text = document.createTextNode("Results");

      th.appendChild(text);
      tr.appendChild(th);
      table.appendChild(tr);

      for(let i = 0; i < matchedArray.length; i += 2)
      {
          //console.log(i);
          let tr = document.createElement('tr');
          let td1 = document.createElement('td');
          let td2 = document.createElement('td');
          let td3 = document.createElement('td');
          
          let text1 = document.createTextNode(familyMode ? (matchedArray[i].text).slice(0 ,(matchedArray[i].text).length - 2) : matchedArray[i].text);
          let text2 = document.createTextNode('\u27A1');
          let text3 = document.createTextNode(familyMode ? (matchedArray[i + 1].text).slice(0 ,(matchedArray[i + 1].text).length - 2) : matchedArray[i + 1].text);
          
          td1.appendChild(text1);
          td2.appendChild(text2);
          td3.appendChild(text3);
          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);

            
          table.appendChild(tr);
      }
      
      results.style.display = 'block';
      results.append(table);
      

  }

  //Shuffle the users to be randomly matched
  function shuffle(array) {
          for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
           [array[i], array[j]] = [array[j], array[i]];
        }
          return array;
      }


  const wrapper = document.querySelector('.name-entry-wrapper');

  console.log(wrapper.getBoundingClientRect().top);



  addNameBtn.addEventListener('submit', addName);
  removeNamesBtn.addEventListener('click', removeNames);
  matchUpBtn.addEventListener('click', matchNames);
  reset.addEventListener('click', resetAll);
  nameList.addEventListener('click', toggleChecked);


});