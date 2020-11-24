$(async function () {
    const user = await getCurrentUser()

    if (user == null) {
        alert("403 Forbidden")
        return
    }

    $root.append(createNavbar())
    $root.append(`<div id="root-content" class="container"></div>`)
    $('div#root-content').append(`<br><div class="columns is-centered"><h1 class="title is-2">Welcome, ${user.email}!</h1></div>`)
    $('div#root-content').append(createSearch())


    let ac = new AmazonAutocomplete({
        selector: '#recipe-search',
        delay: 200,
        showWords: true,
        hideOnblur: true
    })

    configSearch()
    configNav()
    myAccountOnClick()
    verifyOnClick()
})

const $root = $('#root');

const createNavbar = () => {
    const nav = `<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="./dashboard.html">
      <img src="../logo.png" width="30" height="30">
    </a>

    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item">
        About
      </a>
      <a class="navbar-item" id="my-recipes">
        My Recipes
      </a>
      
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          Setting
        </a>
        <div class="navbar-dropdown">
          <a class="navbar-item myAccount">
            My Account
          </a>               
        </div>
      </div>    
      
        <div class="buttons">        
          <a class="button is-danger" id="sign-out">
            <strong>Sign out</strong>
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>
      `

    return nav
}

/*creates and returns an html element (as a string) with a search bar and submit button*/
const createSearch = () => {
    const div = `<br>
                  <div class="columns is-centered searchbar">
                    <div class="column is-half">
                     <div class="field has-addons">
                        <div class="control is-expanded">
                            <input id='recipe-search' autocomplete="on" class="input" type="text" placeholder="Your Favorite Recipe" style="z-index: 2">
                        </div>
                        <div class="control">
                             <button id='recipe-submit'class="button is-success searchButton">Search</button>
                        </div>
                      </div>
                   </div>
                </div>`
    return div
}

/*Adds callbacks to search submit button*/
const configSearch = () => {
    const submit = $('#recipe-submit')
    const searchBar = $('input#recipe-search')

    submit.on('click', () => {
        const searchText = searchBar.val()
        const searchResult = requestRecipeSearch('q', searchText)
        searchResult.then((res) => {
            $('.searchResult').empty()
            renderSearchResults(res)
        }).catch((error) => {
            alert(error)
        })
    })
}

/*takes in api response from search query and appends to root*/
const renderSearchResults = (response) => {

    const $rootContent = $('div#root-content')
    $rootContent.append(`<div class="container wrapper" style="margin-top: 30px;"></div>`)

    for(let i=0; i<response.hits.length; i++){

        let calories = Math.round(response.hits[i].recipe.calories)
        let dietType = response.hits[i].recipe.dietLabels
        let recipeImage = response.hits[i].recipe.image
        let recipeName = response.hits[i].recipe.label
        let healthLabel = response.hits[i].recipe.healthLabels
        let serving = response.hits[i].recipe.yield

        const results = `<div class="container searchResult">
                            <div class="card">
                               <div class="card-image">
                                <div class="content">
                                    <br>
                                    <figure class="image is-128x128">
                                      <img src="${recipeImage}" alt="Placeholder image">
                                    </figure>
                                </div>
                              </div>
                            <div class="card-content">
                                <div class="content">
                                  <p>${recipeName}</p>
                                  <p>Calories: ${calories}</p>
                                  <p>Serving: ${serving}</p>
                                  <p>Diet: ${dietType}</p>
                                  <p>Health Label: ${healthLabel}</p>
                                  <button class="button is-danger saveButton">Save</button>
                                  <button class="button infoButton">More Information</button>
                                </div>
                              </div>
                            </div>                         
                        </div>`
        
        $('div#root-content').append(results)
    }

    infoButtonOnClick(response);
    saveButtonOnClick(response);
}

const infoButtonOnClick = (response) => {
    $root.on('click','.infoButton',function () {
        let recipe = event.target.parentNode.children[0].textContent;
        renderInformationModal(response, recipe)
    })
}

const saveButtonOnClick = (response) => {
  $root.on('click', '.saveButton', function() {
    event.target.parentNode.append(`Recipe Saved!`);
    let recipe_name = event.target.parentNode.children[0].textContent;
    let recipe = response.hits.find(x=> x.recipe.label == recipe_name).recipe;
    saveRecipe(recipe);
  })
}

async function saveRecipe(recipe) {
  let user = await getCurrentUser();
  let response = await $.ajax(location.origin+"/user/"+user.id+"/recipe", {
    type: "POST",
    dataType: "JSON",
    data: {
        "recipe": recipe,
    }}).catch((error) => {
      alert(error)
    })
}

const myAccountOnClick = () => {
    $root.on('click','.myAccount',function(){
        //renderEditForm()
        renderEditForm()
    })
}

const renderInformationModal = (response, recipe) => {

    /** find ingredients and nutrient info from response given a recipe name */
    let cur = response.hits.find(x => x.recipe.label == recipe);

    let ingredients = cur.recipe.ingredients;
    let url = cur.recipe.url;

    let ingredList = ""
    ingredients.forEach(ing => {
      ingredList += `<p>-` + String(Object.values(ing)).split(',')[0] + `</p>`
    })


    let infoModal = document.createElement('div');
    infoModal.setAttribute('class','modal is-active');
    infoModal.innerHTML = `
        <div class="modal-background"></div>
              <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Ingredient and Source Info</p>
                </header>
            <section class="modal-card-body">
                <form class="box">
                  <h4>Ingredients:</h4>` +
                    ingredList +
                  `<a href = "${url}" target="_blank">Recipe Source</a>                                                    
                </form>
               </section>
        <footer class="modal-card-foot">
        <button class="modal-close is-large" aria-label="close" id="cancelButton" onclick="$('.modal').removeClass('is-active');"></button>        
`
    $root.append(infoModal)
}

const renderEditForm = () => {
    let editModal = document.createElement('div');
    editModal.setAttribute('class','modal is-active');
    editModal.innerHTML = `
        <div class="modal-background"></div>
              <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Edit User Information</p>
                </header>
            <section class="modal-card-body">
                <form class="box">
                    <div class="field">
                    <label class="label">Current Email</label>
                       <p class="control has-icons-left has-icons-right">                                        
                          <input class="input" id="currentUserEmail" type="email" placeholder="Current Email">
                            <span class="icon is-small is-left">
                               <i class="fas fa-at"></i>    
                            </span>
                       </p>                     
                     </div>
                     <div class="field">
                       <label class="label">Current Password</label>
                         <p class="control has-icons-left">
                           <input class="input" id="currentUserPassword" type="password" placeholder="Current Password">
                             <span class="icon is-small is-left">
                               <i class="fas fa-lock"></i>
                             </span>
                         </p>                       
                       </div>
                     <div class="field">
                    <label class="label">New Email</label>
                       <p class="control has-icons-left has-icons-right">                                        
                          <input class="input" id="newUserEmail" type="email" placeholder="New Email?">
                            <span class="icon is-small is-left">
                               <i class="fas fa-at"></i>    
                            </span>
                       </p>                     
                     </div>
                     <div class="field">
                       <label class="label">New Password</label>
                         <p class="control has-icons-left">
                           <input class="input" id="newUserPassword" type="password" placeholder="New Password?">
                             <span class="icon is-small is-left">
                               <i class="fas fa-lock"></i>
                             </span>
                         </p>                       
                       </div>                                         
                </form>
                <div class="field">
                   <div class="control">
                        <p id="verificationMessage"></p>
                   </div>
                </div>
               </section>
        <footer class="modal-card-foot">
        <button class="button is-danger updateCredentialButton" >Update Credentials!</button>
        <button class="modal-close is-large" aria-label="close" id="cancelButton" onclick="$('.modal').removeClass('is-active');"></button>        
`
    $root.append(editModal)
}

const verifyOnClick = () => {

    let email = ''
    let password = ''
    let ne = ''
    let np = ''

    $root.on('click','.updateCredentialButton', function(){
        email = $('input#currentUserEmail').val()
        password = $('input#currentUserPassword').val()
        ne = $('input#newUserEmail').val()
        np = $('input#newUserPassword').val()
        verificationRequest(email,password,ne,np)
    })
}

const configNav = () => {
    const signOut = $('a#sign-out')
    signOut.on('click', () => {
      logOutOnClick();
      alert('Signed out')
    })

    const about = $('a#about')
    about.on('click', () => {
        if (Math.random()<=0.33) {
            window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO'
        } else {
            alert('about')
        }
    })

    const myRecipes = $('a#my-recipes')
    myRecipes.on('click', () => {
        // TODO go to my recipes pages
        const rootContent = $('div#root-content')
        rootContent.empty()
        getRecipes();
    })
}

const renderMyRecipes = function(recipes) {
  const rootContent = $('div#root-content')
  recipes.forEach(rec => {
      let calories = Math.round(rec.calories)
      let dietType = rec.dietLabels
      let recipeImage = rec.image
      let recipeName = rec.label
      let healthLabel = rec.healthLabels
      let serving = rec.yield

        const results = `<div class="container searchResult">
                            <div class="card">
                               <div class="card-image">
                                <div class="content">
                                    <br>
                                    <figure class="image is-128x128">
                                      <img src="${recipeImage}" alt="Placeholder image">
                                    </figure>
                                </div>
                              </div>
                            <div class="card-content">
                                <div class="content">
                                  <p>${recipeName}</p>
                                  <p>Calories: ${calories}</p>
                                  <p>Serving: ${serving}</p>
                                  <p>Diet: ${dietType}</p>
                                  <p>Health Label: ${healthLabel}</p>
                                  <button class="button is-danger deletebtn">Delete</button>
                                  <button class="button infoButton">More Information</button>
                                  <button class="button is-warning notes">Personal Notes</button>
                                </div>
                              </div>
                            </div>                         
                        </div>`
        
        rootContent.append(results)
  })
  infoButtonOnClick(response);
}

async function getRecipes() {
  let user = await getCurrentUser()
  await $.ajax(location.origin+"/user/"+user.id+"/data", {
    type: "GET",
    success: function(response) {
      renderMyRecipes(response.recipes)
    }
  })
}

async function logOutOnClick() {
  await $.ajax(location.origin+"/logout", {
    type: "GET",
  }).then(() => {
    setTimeout(function () {
      window.location.href = "../index.html";
    }, 1000);
  })
}

async function verificationRequest(email,password,newEmail,newPassword){
    const currentUser = await getCurrentUser()
    const $verificationMessage = $('#verificationMessage')
    await $.ajax(location.origin+"/user/"+currentUser.id,{
        type: "PUT",
        data: {
            "email": email,
            "password": password,
            "newEmail": newEmail,
            "newPassword": newPassword
        }
    }).then(() => {
        $verificationMessage.html('<span class="has-text-success">Credentials updated successfully</span>');
    }).catch(() => {
        $verificationMessage.html('<span class="has-text-danger">Invalid current email/password</span>');
    })
}