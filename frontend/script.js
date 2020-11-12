$(function(){
    renderNavBar();
})


const renderNavBar = function(){
    const $root = $('#root');

    $root.append(`<div class="hero is-fullheight has-background-success-light bg-img">
                    <div class="hero-body">
                        <div class="container">
                            <div class="columns is-centered">
                                <div class="column is-4-desktop">
                                    <form class="box">
                                       <div class="field">
                                           <label class="label">Email</label>
                                        <p class="control has-icons-left has-icons-right">                                        
                                            <input class="input" type="email" placeholder="Email">
                                                <span class="icon is-small is-left">
                                                    <i class="fas fa-at"></i>    
                                                </span>
                                                <span class="icon is-small is-right">
                                                    <i class="fas fa-check"></i>
                                                </span>
                                        </p>
                                </div>
                                    <div class="field">
                                    <label class="label">Password</label>
                                      <p class="control has-icons-left">
                                        <input class="input" type="password" placeholder="Password">
                                        <span class="icon is-small is-left">
                                          <i class="fas fa-lock"></i>
                                        </span>
                                      </p>
                                    </div>
                                    <div class="field">
                                    <a href="#">Sign up</a>                                                             
                                    </div>
                                    <div class="field">
                                    <a href="#">Forgot Password?</a>                                                             
                                    </div>
                                    
                                    
                                    <div class="field">
                                      <p class="control">
                                        <button class="button is-rounded is-success">
                                          Login
                                        </button>
                                      </p>
                                    </div>
                                    
</form>
</div>
</div>
</div>
</div>
</div>     `)


}