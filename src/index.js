document.addEventListener('DOMContentLoaded', function() {
    function renderInitial(){
    fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(function(data) {
    //advanced method using a function to create arrays of the key names
    renderAllDogs(data)

    //render all dogs on top of page
    function renderAllDogs(dogs){
        //console.log("dogs",dogs)
        dogs.forEach(renderSingleDog)
    }
    }) //end of .then of first fetch
    }

    //function that pulls a single dog and then displays the dog(based on a cb function) based on a click event listener
    function renderSingleDog(oneDog){
        let span = document.createElement('span')
        span.innerText = oneDog.name
        document.querySelector('#dog-bar').append(span)
        span.addEventListener('click', (e) => {
            dogClick(e, oneDog.image, oneDog.isGoodDog, oneDog.name, oneDog.id)
        })
    }


    //function that display the current dog
    function dogClick(event, imgUrl, goodBad, dogName, dogID){
        //console.log(event.target, imgUrl, goodBad)
        let dogInfoArea = document.querySelector('#dog-info')
        dogInfoArea.innerHTML = ""

        let img = document.createElement('img')
        img.src = imgUrl
        let hTwo = document.createElement('h2')
        hTwo.innerText = dogName
        let button = document.createElement('button')
        button.innerText = (goodBad ? "Good Dog" : "Bad Dog")
        dogInfoArea.append(img, hTwo, button)
        //console.log(dogInfoArea)

        button.addEventListener('click',(e) =>{
            changeStatus(button, goodBad, dogID)
        })
    }

    //function to change the data from true to false, vice versa
    function changeStatus(button, goodBad, dogID){
        fetch(`http://localhost:3000/pups/${dogID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                isGoodDog: !goodBad
            })
        })
        .then(resp => resp.json())
        .then(function(data){
            dogClick(event, data.image, data.isGoodDog, data.name, data.id)
            reRenderTrueDogs()
        }
        )} //end of changeStatus function

        //displays the new list of dogs that are true (requires cb function)
        function reRenderTrueDogs(){
            fetch("http://localhost:3000/pups")
            .then(resp => resp.json())
            .then(function(data){
                renderTrueFalseDog(data)
            })
        }

        let toggle = document.querySelector('#good-dog-filter')
        toggle.addEventListener('click', function(){
            fetch("http://localhost:3000/pups")
            .then(resp => resp.json())
            .then(function(data) {
                if(toggle.innerText === "Filter good dogs: OFF") {
                    toggle.innerText = "Filter good dogs: ON"
                    renderTrueFalseDog(data)
                } else {
                    toggle.innerText = "Filter good dogs: OFF"
                    document.querySelector('#dog-bar').innerHTML = ''
                    data.forEach(renderSingleDog) //line 19
                }
        })
        })

        //function that renders all the true dogs
        function renderTrueFalseDog(dog){
            document.querySelector('#dog-bar').innerHTML = ''
            
            let trueFalse = dog.filter(status => {
                return status.isGoodDog == true
            })
            trueFalse.forEach(renderStatusDog)
            }

        //function that redisplays the dog info(img, name and button) based on the filtered true dogs
        function renderStatusDog(oneDog){
            let span = document.createElement('span')
            span.innerText = oneDog.name
            document.querySelector('#dog-bar').append(span)
            span.addEventListener('click', (e) => {
                dogClick(e, oneDog.image, oneDog.isGoodDog, oneDog.name, oneDog.id)
        })
    }        
renderInitial()
}) //end of DOMContent