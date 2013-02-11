  


<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# githubog: http://ogp.me/ns/fb/githubog#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>socket.io/client/socket.io.js at master · LearnBoost/socket.io</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub" />
    <link rel="apple-touch-icon-precomposed" sizes="57x57" href="apple-touch-icon-114.png" />
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="apple-touch-icon-114.png" />
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="apple-touch-icon-144.png" />
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="apple-touch-icon-144.png" />
    <link rel="logo" type="image/svg" href="http://github-media-downloads.s3.amazonaws.com/github-logo.svg" />
    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-TileColor" content="#ffffff">

    
    
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />

    <meta content="authenticity_token" name="csrf-param" />
<meta content="WDv7lkVklcND9PkCR0Q13SYeW5NisrUl2Zq+pXQ0L4s=" name="csrf-token" />

    <link href="https://a248.e.akamai.net/assets.github.com/assets/github-b29c8fd21c980163b52c7eba741bec96d18e5ba8.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="https://a248.e.akamai.net/assets.github.com/assets/github2-0c22d17b5fe3c136bf438c793ff8318732e2d3a1.css" media="screen" rel="stylesheet" type="text/css" />
    


      <script src="https://a248.e.akamai.net/assets.github.com/assets/frameworks-5dcdaf734c8092261f37e6534c8f114696d913a9.js" type="text/javascript"></script>
      <script src="https://a248.e.akamai.net/assets.github.com/assets/github-47a3a09fdb39a3cc73da291f394b4c33a2695b7b.js" type="text/javascript"></script>
      

        <link rel='permalink' href='/LearnBoost/socket.io/blob/0d5200ed696f4dc442efd00ab5d09b004294b762/client/socket.io.js'>
    <meta property="og:title" content="socket.io"/>
    <meta property="og:type" content="githubog:gitrepository"/>
    <meta property="og:url" content="https://github.com/LearnBoost/socket.io"/>
    <meta property="og:image" content="https://secure.gravatar.com/avatar/07100ee5e8dedd7c96195b2aa422dbb5?s=420&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"/>
    <meta property="og:site_name" content="GitHub"/>
    <meta property="og:description" content="socket.io - Realtime application framework for Node.JS, with HTML5 WebSockets and cross-browser fallbacks support."/>
    <meta property="twitter:card" content="summary"/>
    <meta property="twitter:site" content="@GitHub">
    <meta property="twitter:title" content="LearnBoost/socket.io"/>

    <meta name="description" content="socket.io - Realtime application framework for Node.JS, with HTML5 WebSockets and cross-browser fallbacks support." />

  <link href="https://github.com/LearnBoost/socket.io/commits/master.atom" rel="alternate" title="Recent Commits to socket.io:master" type="application/atom+xml" />

  </head>


  <body class="logged_in page-blob linux vis-public env-production  ">
    <div id="wrapper">

      

      

      

      


        <div class="header header-logged-in true">
          <div class="container clearfix">

            <a class="header-logo-blacktocat" href="https://github.com/">
  <span class="mega-icon mega-icon-blacktocat"></span>
</a>

            <div class="divider-vertical"></div>

              <a href="/notifications" class="notification-indicator tooltipped downwards" title="You have no unread notifications">
    <span class="mail-status all-read"></span>
  </a>
  <div class="divider-vertical"></div>


              <div class="topsearch command-bar-activated ">
  <form accept-charset="UTF-8" action="/search" class="command_bar_form" id="top_search_form" method="get">
  <a href="/search/advanced" class="advanced-search-icon tooltipped downwards command-bar-search" id="advanced_search" title="Advanced search"><span class="mini-icon mini-icon-advanced-search "></span></a>

  <input type="text" name="q" id="command-bar" placeholder="Search or type a command" tabindex="1" data-username="louischatriot" autocapitalize="off">

  <span class="mini-icon help tooltipped downwards" title="Show command bar help">
    <span class="mini-icon mini-icon-help"></span>
  </span>

  <input type="hidden" name="ref" value="commandbar">

  <div class="divider-vertical"></div>
</form>
  <ul class="top-nav">
      <li class="explore"><a href="https://github.com/explore">Explore</a></li>
      <li><a href="https://gist.github.com">Gist</a></li>
      <li><a href="/blog">Blog</a></li>
    <li><a href="http://help.github.com">Help</a></li>
  </ul>
</div>


            

  
    <ul id="user-links">
      <li>
        <a href="https://github.com/louischatriot" class="name">
          <img height="20" src="https://secure.gravatar.com/avatar/e47076995bbe79cfdf507d7bbddbe106?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /> louischatriot
        </a>
      </li>
      <li>
        <a href="/new" id="new_repo" class="tooltipped downwards" title="Create a new repo">
          <span class="mini-icon mini-icon-create"></span>
        </a>
      </li>
      <li>
        <a href="/settings/profile" id="account_settings"
          class="tooltipped downwards"
          title="Account settings ">
          <span class="mini-icon mini-icon-account-settings"></span>
        </a>
      </li>
      <li>
        <a href="/logout" data-method="post" id="logout" class="tooltipped downwards" title="Sign out">
          <span class="mini-icon mini-icon-logout"></span>
        </a>
      </li>
    </ul>



            
          </div>
        </div>


      

      


            <div class="site hfeed" itemscope itemtype="http://schema.org/WebPage">
      <div class="hentry">
        
        <div class="pagehead repohead instapaper_ignore readability-menu">
          <div class="container">
            <div class="title-actions-bar">
              


<ul class="pagehead-actions">


    <li class="subscription">
      <form accept-charset="UTF-8" action="/notifications/subscribe" data-autosubmit="true" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="authenticity_token" type="hidden" value="WDv7lkVklcND9PkCR0Q13SYeW5NisrUl2Zq+pXQ0L4s=" /></div>  <input id="repository_id" name="repository_id" type="hidden" value="557980" />

    <div class="select-menu js-menu-container js-select-menu">
      <span class="minibutton select-menu-button js-menu-target">
        <span class="js-select-button">
          <span class="mini-icon mini-icon-watching"></span>
          Watch
        </span>
      </span>

      <div class="select-menu-modal-holder js-menu-content">
        <div class="select-menu-modal">
          <div class="select-menu-header">
            <span class="select-menu-title">Notification status</span>
            <span class="mini-icon mini-icon-remove-close js-menu-close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-list js-navigation-container js-select-menu-pane">

            <div class="select-menu-item js-navigation-item js-navigation-target selected">
              <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
              <div class="select-menu-item-text">
                <input checked="checked" id="do_included" name="do" type="radio" value="included" />
                <h4>Not watching</h4>
                <span class="description">You only receive notifications for discussions in which you participate or are @mentioned.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="mini-icon mini-icon-watching"></span>
                  Watch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item js-navigation-target ">
              <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
              <div class="select-menu-item-text">
                <input id="do_subscribed" name="do" type="radio" value="subscribed" />
                <h4>Watching</h4>
                <span class="description">You receive notifications for all discussions in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="mini-icon mini-icon-unwatch"></span>
                  Unwatch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item js-navigation-target ">
              <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
              <div class="select-menu-item-text">
                <input id="do_ignore" name="do" type="radio" value="ignore" />
                <h4>Ignoring</h4>
                <span class="description">You do not receive any notifications for discussions in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="mini-icon mini-icon-mute"></span>
                  Stop ignoring
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

</form>
    </li>

    <li class="js-toggler-container js-social-container starring-container ">
      <a href="/LearnBoost/socket.io/unstar" class="minibutton js-toggler-target star-button starred upwards" title="Unstar this repo" data-remote="true" data-method="post" rel="nofollow">
        <span class="mini-icon mini-icon-remove-star"></span>
        <span class="text">Unstar</span>
      </a>
      <a href="/LearnBoost/socket.io/star" class="minibutton js-toggler-target star-button unstarred upwards" title="Star this repo" data-remote="true" data-method="post" rel="nofollow">
        <span class="mini-icon mini-icon-star"></span>
        <span class="text">Star</span>
      </a>
      <a class="social-count js-social-count" href="/LearnBoost/socket.io/stargazers">7,475</a>
    </li>

        <li>
          <a href="/LearnBoost/socket.io/fork_select" class="minibutton js-toggler-target fork-button lighter upwards" title="Fork this repo" rel="facebox nofollow">
            <span class="mini-icon mini-icon-branch-create"></span>
            <span class="text">Fork</span>
          </a>
          <a href="/LearnBoost/socket.io/network" class="social-count">1,021</a>
        </li>


</ul>

              <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
                <span class="repo-label"><span>public</span></span>
                <span class="mega-icon mega-icon-public-repo"></span>
                <span class="author vcard">
                  <a href="/LearnBoost" class="url fn" itemprop="url" rel="author">
                  <span itemprop="title">LearnBoost</span>
                  </a></span> /
                <strong><a href="/LearnBoost/socket.io" class="js-current-repository">socket.io</a></strong>
              </h1>
            </div>

            

  <ul class="tabs">
    <li><a href="/LearnBoost/socket.io" class="selected" highlight="[:repo_source, :repo_downloads, :repo_commits, :repo_tags, :repo_branches]">Code</a></li>
    <li><a href="/LearnBoost/socket.io/network" highlight="[:repo_network]">Network</a></li>
    <li><a href="/LearnBoost/socket.io/pulls" highlight="[:repo_pulls]">Pull Requests <span class='counter'>57</span></a></li>

      <li><a href="/LearnBoost/socket.io/issues" highlight="[:repo_issues]">Issues <span class='counter'>412</span></a></li>

      <li><a href="/LearnBoost/socket.io/wiki" highlight="[:repo_wiki]">Wiki</a></li>


    <li><a href="/LearnBoost/socket.io/graphs" highlight="[:repo_graphs, :repo_contributors]">Graphs</a></li>


  </ul>
  
<div class="tabnav">

  <span class="tabnav-right">
    <ul class="tabnav-tabs">
          <li><a href="/LearnBoost/socket.io/tags" class="tabnav-tab" highlight="repo_tags">Tags <span class="counter ">74</span></a></li>
    </ul>
    
  </span>

  <div class="tabnav-widget scope">


    <div class="select-menu js-menu-container js-select-menu js-branch-menu">
      <a class="minibutton select-menu-button js-menu-target" data-hotkey="w" data-ref="master">
        <span class="mini-icon mini-icon-branch"></span>
        <i>branch:</i>
        <span class="js-select-button">master</span>
      </a>

      <div class="select-menu-modal-holder js-menu-content js-navigation-container js-select-menu-pane">

        <div class="select-menu-modal js-select-menu-pane">
          <div class="select-menu-header">
            <span class="select-menu-title">Switch branches/tags</span>
            <span class="mini-icon mini-icon-remove-close js-menu-close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-filters">
            <div class="select-menu-text-filter">
              <input type="text" id="commitish-filter-field" class="js-select-menu-text-filter js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
            </div> <!-- /.select-menu-text-filter -->
            <div class="select-menu-tabs">
              <ul>
                <li class="select-menu-tab">
                  <a href="#" data-tab-filter="branches" class="js-select-menu-tab">Branches</a>
                </li>
                <li class="select-menu-tab">
                  <a href="#" data-tab-filter="tags" class="js-select-menu-tab">Tags</a>
                </li>
              </ul>
            </div><!-- /.select-menu-tabs -->
          </div><!-- /.select-menu-filters -->

          <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket css-truncate" data-tab-filter="branches" data-filterable-for="commitish-filter-field" data-filterable-type="substring">



              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                <a href="/LearnBoost/socket.io/blob/0.9/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9" rel="nofollow" title="0.9">0.9</a>
              </div> <!-- /.select-menu-item -->

              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                <a href="/LearnBoost/socket.io/blob/06/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="06" rel="nofollow" title="06">06</a>
              </div> <!-- /.select-menu-item -->

              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                <a href="/LearnBoost/socket.io/blob/1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="1" rel="nofollow" title="1">1</a>
              </div> <!-- /.select-menu-item -->

              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                <a href="/LearnBoost/socket.io/blob/1.0/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="1.0" rel="nofollow" title="1.0">1.0</a>
              </div> <!-- /.select-menu-item -->

              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                <a href="/LearnBoost/socket.io/blob/develop/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="develop" rel="nofollow" title="develop">develop</a>
              </div> <!-- /.select-menu-item -->

              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                <a href="/LearnBoost/socket.io/blob/gh-pages/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="gh-pages" rel="nofollow" title="gh-pages">gh-pages</a>
              </div> <!-- /.select-menu-item -->

              <div class="select-menu-item js-navigation-item js-navigation-target selected">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                <a href="/LearnBoost/socket.io/blob/master/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="master" rel="nofollow" title="master">master</a>
              </div> <!-- /.select-menu-item -->

              <div class="select-menu-no-results js-not-filterable">Nothing to show</div>
          </div> <!-- /.select-menu-list -->


          <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket css-truncate" data-tab-filter="tags" data-filterable-for="commitish-filter-field" data-filterable-type="substring">

              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.13/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.13" rel="nofollow" title="0.9.13">0.9.13</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.12/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.12" rel="nofollow" title="0.9.12">0.9.12</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.11/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.11" rel="nofollow" title="0.9.11">0.9.11</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.10/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.10" rel="nofollow" title="0.9.10">0.9.10</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.9/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.9" rel="nofollow" title="0.9.9">0.9.9</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.8/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.8" rel="nofollow" title="0.9.8">0.9.8</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.7/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.7" rel="nofollow" title="0.9.7">0.9.7</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.5/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.5" rel="nofollow" title="0.9.5">0.9.5</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.4/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.4" rel="nofollow" title="0.9.4">0.9.4</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.3/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.3" rel="nofollow" title="0.9.3">0.9.3</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.2/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.2" rel="nofollow" title="0.9.2">0.9.2</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.1-1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.1-1" rel="nofollow" title="0.9.1-1">0.9.1-1</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.1" rel="nofollow" title="0.9.1">0.9.1</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.9.0/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.9.0" rel="nofollow" title="0.9.0">0.9.0</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.8.7/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.8.7" rel="nofollow" title="0.8.7">0.8.7</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.8.6/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.8.6" rel="nofollow" title="0.8.6">0.8.6</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.8.5/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.8.5" rel="nofollow" title="0.8.5">0.8.5</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.8.4/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.8.4" rel="nofollow" title="0.8.4">0.8.4</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.8.3/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.8.3" rel="nofollow" title="0.8.3">0.8.3</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.8.2/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.8.2" rel="nofollow" title="0.8.2">0.8.2</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.8.1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.8.1" rel="nofollow" title="0.8.1">0.8.1</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.8.0/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.8.0" rel="nofollow" title="0.8.0">0.8.0</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.11/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.11" rel="nofollow" title="0.7.11">0.7.11</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.10/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.10" rel="nofollow" title="0.7.10">0.7.10</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.9/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.9" rel="nofollow" title="0.7.9">0.7.9</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.8/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.8" rel="nofollow" title="0.7.8">0.7.8</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.7/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.7" rel="nofollow" title="0.7.7">0.7.7</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.6/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.6" rel="nofollow" title="0.7.6">0.7.6</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.5/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.5" rel="nofollow" title="0.7.5">0.7.5</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.4/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.4" rel="nofollow" title="0.7.4">0.7.4</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.3/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.3" rel="nofollow" title="0.7.3">0.7.3</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.2/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.2" rel="nofollow" title="0.7.2">0.7.2</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.1" rel="nofollow" title="0.7.1">0.7.1</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.7.0/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.7.0" rel="nofollow" title="0.7.0">0.7.0</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.17/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.17" rel="nofollow" title="0.6.17">0.6.17</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.16/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.16" rel="nofollow" title="0.6.16">0.6.16</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.15/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.15" rel="nofollow" title="0.6.15">0.6.15</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.14/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.14" rel="nofollow" title="0.6.14">0.6.14</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.13/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.13" rel="nofollow" title="0.6.13">0.6.13</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.12/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.12" rel="nofollow" title="0.6.12">0.6.12</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.11/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.11" rel="nofollow" title="0.6.11">0.6.11</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.10/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.10" rel="nofollow" title="0.6.10">0.6.10</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.9/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.9" rel="nofollow" title="0.6.9">0.6.9</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.8/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.8" rel="nofollow" title="0.6.8">0.6.8</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.7/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.7" rel="nofollow" title="0.6.7">0.6.7</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.6/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.6" rel="nofollow" title="0.6.6">0.6.6</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.5/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.5" rel="nofollow" title="0.6.5">0.6.5</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.4/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.4" rel="nofollow" title="0.6.4">0.6.4</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.3/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.3" rel="nofollow" title="0.6.3">0.6.3</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.2/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.2" rel="nofollow" title="0.6.2">0.6.2</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.1" rel="nofollow" title="0.6.1">0.6.1</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6.0/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6.0" rel="nofollow" title="0.6.0">0.6.0</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.6/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.6" rel="nofollow" title="0.6">0.6</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.5.3/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.5.3" rel="nofollow" title="0.5.3">0.5.3</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.5.2/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.5.2" rel="nofollow" title="0.5.2">0.5.2</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.5.1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.5.1" rel="nofollow" title="0.5.1">0.5.1</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.5/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.5" rel="nofollow" title="0.5">0.5</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.4.1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.4.1" rel="nofollow" title="0.4.1">0.4.1</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.4/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.4" rel="nofollow" title="0.4">0.4</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3.9/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3.9" rel="nofollow" title="0.3.9">0.3.9</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3.8/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3.8" rel="nofollow" title="0.3.8">0.3.8</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3.7/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3.7" rel="nofollow" title="0.3.7">0.3.7</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3.6/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3.6" rel="nofollow" title="0.3.6">0.3.6</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3.5/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3.5" rel="nofollow" title="0.3.5">0.3.5</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3.4/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3.4" rel="nofollow" title="0.3.4">0.3.4</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3.3/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3.3" rel="nofollow" title="0.3.3">0.3.3</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3.2/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3.2" rel="nofollow" title="0.3.2">0.3.2</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3.1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3.1" rel="nofollow" title="0.3.1">0.3.1</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.3/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.3" rel="nofollow" title="0.3">0.3</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.2.3/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.2.3" rel="nofollow" title="0.2.3">0.2.3</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.2.2/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.2.2" rel="nofollow" title="0.2.2">0.2.2</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.2.1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.2.1" rel="nofollow" title="0.2.1">0.2.1</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.2/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.2" rel="nofollow" title="0.2">0.2</a>

              </div> <!-- /.select-menu-item -->
              <div class="select-menu-item js-navigation-item js-navigation-target ">
                <span class="select-menu-checkmark mini-icon mini-icon-confirm"></span>
                    <a href="/LearnBoost/socket.io/blob/0.1/client/socket.io.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="0.1" rel="nofollow" title="0.1">0.1</a>

              </div> <!-- /.select-menu-item -->

            <div class="select-menu-no-results js-not-filterable">Nothing to show</div>

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

  </div> <!-- /.scope -->

  <ul class="tabnav-tabs">
    <li><a href="/LearnBoost/socket.io" class="selected tabnav-tab" highlight="repo_source">Files</a></li>
    <li><a href="/LearnBoost/socket.io/commits/master" class="tabnav-tab" highlight="repo_commits">Commits</a></li>
    <li><a href="/LearnBoost/socket.io/branches" class="tabnav-tab" highlight="repo_branches" rel="nofollow">Branches <span class="counter ">7</span></a></li>
  </ul>

</div>

  
  
  


            
          </div>
        </div><!-- /.repohead -->

        <div id="js-repo-pjax-container" class="container context-loader-container" data-pjax-container>
          


<!-- blob contrib key: blob_contributors:v21:58a41f24f7af24fd326521a0372f1212 -->
<!-- blob contrib frag key: views10/v8/blob_contributors:v21:58a41f24f7af24fd326521a0372f1212 -->


<div id="slider">
    <div class="frame-meta">

      <p title="This is a placeholder element" class="js-history-link-replace hidden"></p>

        <div class="breadcrumb">
          <span class='bold'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/LearnBoost/socket.io" class="js-slide-to" data-direction="back" itemscope="url"><span itemprop="title">socket.io</span></a></span></span> / <span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/LearnBoost/socket.io/tree/master/client" class="js-slide-to" data-direction="back" itemscope="url"><span itemprop="title">client</span></a></span> / <strong class="final-path">socket.io.js</strong> <span class="js-zeroclipboard zeroclipboard-button" data-clipboard-text="client/socket.io.js" data-copied-hint="copied!" title="copy to clipboard"><span class="mini-icon mini-icon-clipboard"></span></span>
        </div>

      <a href="/LearnBoost/socket.io/find/master" class="js-slide-to" data-hotkey="t" style="display:none">Show File Finder</a>


        
  <div class="commit file-history-tease">
    <img class="main-avatar" height="24" src="https://secure.gravatar.com/avatar/486e20e16ef676a02ac0299d2f92b813?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
    <span class="author"><a href="/guille" rel="author">guille</a></span>
    <time class="js-relative-date" datetime="2012-12-13T11:38:58-08:00" title="2012-12-13 11:38:58">December 13, 2012</time>
    <div class="commit-title">
        <a href="/LearnBoost/socket.io/commit/5f397464a9d1428afbeaf866f8db03d81afdd2ac" class="message">client: added static files</a>
    </div>

    <div class="participation">
      <p class="quickstat"><a href="#blob_contributors_box" rel="facebox"><strong>1</strong> contributor</a></p>
      
    </div>
    <div id="blob_contributors_box" style="display:none">
      <h2>Users on GitHub who have contributed to this file</h2>
      <ul class="facebox-user-list">
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/486e20e16ef676a02ac0299d2f92b813?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/guille">guille</a>
        </li>
      </ul>
    </div>
  </div>


    </div><!-- ./.frame-meta -->

    <div class="frames">
      <div class="frame" data-permalink-url="/LearnBoost/socket.io/blob/0d5200ed696f4dc442efd00ab5d09b004294b762/client/socket.io.js" data-title="socket.io/client/socket.io.js at master · LearnBoost/socket.io · GitHub" data-type="blob">

        <div id="files" class="bubble">
          <div class="file">
            <div class="meta">
              <div class="info">
                <span class="icon"><b class="mini-icon mini-icon-text-file"></b></span>
                <span class="mode" title="File Mode">symbolic link</span>
                  <span>1 lines (1 sloc)</span>
                <span>0.052 kb</span>
              </div>
              <div class="actions">
                <div class="button-group">
                        <a class="minibutton tooltipped leftwards"
                           title="Clicking this button will automatically fork this project so you can edit the file"
                           href="/LearnBoost/socket.io/edit/master/client/socket.io.js"
                           data-method="post" rel="nofollow">Edit</a>
                  <a href="/LearnBoost/socket.io/raw/master/client/socket.io.js" class="button minibutton " id="raw-url">Raw</a>
                    <a href="/LearnBoost/socket.io/blame/master/client/socket.io.js" class="button minibutton ">Blame</a>
                  <a href="/LearnBoost/socket.io/commits/master/client/socket.io.js" class="button minibutton " rel="nofollow">History</a>
                </div><!-- /.button-group -->
              </div><!-- /.actions -->

            </div>
                <div class="data type-javascript js-blob-data">
      <table cellpadding="0" cellspacing="0" class="lines">
        <tr>
          <td>
            <pre class="line_numbers"><span id="L1" rel="#L1">1</span>
</pre>
          </td>
          <td width="100%">
                  <div class="highlight"><pre><div class='line' id='LC1'><span class="p">..</span><span class="o">/</span><span class="nx">node_modules</span><span class="o">/</span><span class="nx">socket</span><span class="p">.</span><span class="nx">io</span><span class="o">-</span><span class="nx">client</span><span class="o">/</span><span class="nx">socket</span><span class="p">.</span><span class="nx">io</span><span class="o">-</span><span class="nx">client</span><span class="p">.</span><span class="nx">js</span></div></pre></div>
          </td>
        </tr>
      </table>
  </div>

          </div>
        </div>

        <a href="#jump-to-line" rel="facebox" data-hotkey="l" class="js-jump-to-line" style="display:none">Jump to Line</a>
        <div id="jump-to-line" style="display:none">
          <h2>Jump to Line</h2>
          <form accept-charset="UTF-8" class="js-jump-to-line-form">
            <input class="textfield js-jump-to-line-field" type="text">
            <div class="full-button">
              <button type="submit" class="button">Go</button>
            </div>
          </form>
        </div>

      </div>
    </div>
</div>

<div id="js-frame-loading-template" class="frame frame-loading large-loading-area" style="display:none;">
  <img class="js-frame-loading-spinner" src="https://a248.e.akamai.net/assets.github.com/images/spinners/octocat-spinner-128.gif?1347543529" height="64" width="64">
</div>


        </div>
      </div>
      <div class="context-overlay"></div>
    </div>

      <div id="footer-push"></div><!-- hack for sticky footer -->
    </div><!-- end of wrapper - hack for sticky footer -->

      <!-- footer -->
      <div id="footer">
  <div class="container clearfix">

      <dl class="footer_nav">
        <dt>GitHub</dt>
        <dd><a href="https://github.com/about">About us</a></dd>
        <dd><a href="https://github.com/blog">Blog</a></dd>
        <dd><a href="https://github.com/contact">Contact &amp; support</a></dd>
        <dd><a href="http://enterprise.github.com/">GitHub Enterprise</a></dd>
        <dd><a href="http://status.github.com/">Site status</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Applications</dt>
        <dd><a href="http://mac.github.com/">GitHub for Mac</a></dd>
        <dd><a href="http://windows.github.com/">GitHub for Windows</a></dd>
        <dd><a href="http://eclipse.github.com/">GitHub for Eclipse</a></dd>
        <dd><a href="http://mobile.github.com/">GitHub mobile apps</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Services</dt>
        <dd><a href="http://get.gaug.es/">Gauges: Web analytics</a></dd>
        <dd><a href="http://speakerdeck.com">Speaker Deck: Presentations</a></dd>
        <dd><a href="https://gist.github.com">Gist: Code snippets</a></dd>
        <dd><a href="http://jobs.github.com/">Job board</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Documentation</dt>
        <dd><a href="http://help.github.com/">GitHub Help</a></dd>
        <dd><a href="http://developer.github.com/">Developer API</a></dd>
        <dd><a href="http://github.github.com/github-flavored-markdown/">GitHub Flavored Markdown</a></dd>
        <dd><a href="http://pages.github.com/">GitHub Pages</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>More</dt>
        <dd><a href="http://training.github.com/">Training</a></dd>
        <dd><a href="https://github.com/edu">Students &amp; teachers</a></dd>
        <dd><a href="http://shop.github.com">The Shop</a></dd>
        <dd><a href="/plans">Plans &amp; pricing</a></dd>
        <dd><a href="http://octodex.github.com/">The Octodex</a></dd>
      </dl>

      <hr class="footer-divider">


    <p class="right">&copy; 2013 <span title="1.15868s from fe13.rs.github.com">GitHub</span> Inc. All rights reserved.</p>
    <a class="left" href="https://github.com/">
      <span class="mega-icon mega-icon-invertocat"></span>
    </a>
    <ul id="legal">
        <li><a href="https://github.com/site/terms">Terms of Service</a></li>
        <li><a href="https://github.com/site/privacy">Privacy</a></li>
        <li><a href="https://github.com/security">Security</a></li>
    </ul>

  </div><!-- /.container -->

</div><!-- /.#footer -->


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-fullscreen-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="js-fullscreen-contents" placeholder="" data-suggester="fullscreen_suggester"></textarea>
          <div class="suggester-container">
              <div class="suggester fullscreen-suggester js-navigation-container" id="fullscreen_suggester"
                 data-url="/LearnBoost/socket.io/suggestions/commit/0d5200ed696f4dc442efd00ab5d09b004294b762">
              </div>
          </div>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped leftwards" title="Exit Zen Mode">
      <span class="mega-icon mega-icon-normalscreen"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped leftwards"
      title="Switch themes">
      <span class="mini-icon mini-icon-brightness"></span>
    </a>
  </div>
</div>



    <div id="ajax-error-message" class="flash flash-error">
      <span class="mini-icon mini-icon-exclamation"></span>
      Something went wrong with that request. Please try again.
      <a href="#" class="mini-icon mini-icon-remove-close ajax-error-dismiss"></a>
    </div>

    
    
    <span id='server_response_time' data-time='1.15935' data-host='fe13'></span>
    
  </body>
</html>

