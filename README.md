# split-brain
Easy, declarative code splitting in React &amp; webpack.

**NOTE: you need to install [babel-plugin-split-brain](https://github.com/mprast/babel-plugin-split-brain) and add it to 
your .babelrc if you're going to use this.**

## What Does this Package Do
Webpack has built-in support for [code splitting](https://webpack.github.io/docs/code-splitting.html). This is cool, but the 
syntax for lazy-loading code is kind of awkward when used with react (what with the `require.ensure` and the async and all). 
SplitBrain takes away a lot of that boiler plate by giving you a `Chunk` element you can use to create a lazy-loaded component.

So, for example, if you did:
```javascript
const SplitBrain = require("split-brain");

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = { doIt: false };
    }

    getTheLazyLoad(doIt){
        if(doIt) {
            return <SplitBrain.Chunk imports={{"Lazy": "components/lazy.js"}}>
                      <Lazy/>
                   </SplitBrain.Chunk>;
        }
    }
    
    render(){
        return <div>
                  <button type="button" onClick={() => this.setState({doIt: true})}>Go</button>
                  {this.getTheLazyLoad(this.state.doIt)}
               </div>;
    }
}
```

webpack would create a new bundle with just `lazy.js` inside, and that bundle would get lazy-loaded when you clicked 'Go'.
The `Chunk` element just returns its children when it renders, it's totally transparent. 

## In-depth Usage
- Put whatever you want inside of SplitBrain. Have nested elements or an expression container:

```javascript
//this is valid
<SplitBrain.Chunk imports={{"One": "components/one.js", 
                            "Two": "components/two.js",
                            "Three": "components/three.js",
                            "Four": "components/four.js"}}>
  <One>
    <Two>
      <Three>
        <Four/>
      </Three>
    </Two>
  </One>
</SplitBrain.Chunk>

//so is this
<SplitBrain.Chunk imports={{"One": "components/one.js"}}>
{
  configureMyOne(withSomeParams)
}
</SplitBrain.Chunk>

//even this!
<SplitBrain.Chunk imports={{"One": "components/one.js",
                            "Two": "components/two.js"}}>
  <One>
    {constructATwo(usingMagic)}
  </One>
</SplitBrain.Chunk>
```
Just remember that *SplitBrain accepts one and only one top-level child*.

- SplitBrain compiles to `require.ensure`, so it's really just Webpack behind the scenes. That means 
  you get a bunch of nice behaviors for free, e.g. a chunk will only get loaded the first time it renders, and
  if a chunk's children have any dependencies, those'll get wrapped up in the bundle and lazy loaded as well.

- In the same vein; you can have nested `Chunk`s. The bundle for a chunk includes all of its children up 
  until the next chunk, and each chunk will get loaded only when it's rendered. For example, if `lazy.js` 
  from our example above looked like this: 
  
```javascript
const SplitBrain = require("split-brain");
const Dazy = require("dazy.js")

class Lazy extends Component {
    constructor(props) {
        super(props);
        this.state = { doIt: false };
    }

    getTheNEWLazyLoad(doIt){
        if(doIt) {
            return <SplitBrain.Chunk imports={{"Hazy": "components/hazy.js"}}>
                      <Hazy/>
                   </SplitBrain.Chunk>;
        }
    }
    
    render(){
        return <div>
                  <Dazy>"I'm here too!"</Dazy>
                  <button type="button" onClick={() => this.setState({doIt: true})}>Go, again!</button>
                  {this.getTheNEWLazyLoad(this.state.doIt)}
               </div>;
    }
}

```
Clicking 'Go!' would load `lazy.js` and `dazy.js`, and clicking 'Go, again!' would load 'hazy.js'.

## What About That `imports` Attribute
SplitBrain is implemented as a combination of a few React components and a Babel plugin. The reason the Babel plugin is 
necessary is that webpack creates its bundles _at build time_. As mentioned above, SplitBrain 
is sugar around `require.ensure()` (Webpack's normal way to define split points), and those calls need to 
be present, with a hardcoded list of modules, before we run any code. So, regrettably, the only thing that can't be 
dynamic is the list of packages to require. It must be a plain object with strings for keys and values. This 
limits the number of things you can do with SplitBrain, but it's tough to get around because ultimately it's 
a limitation of Webpack (and, I think, a sensible one).

## Turning It Off
You can disable SplitBrain by setting up your .babelrc like this:

```
{
    // other options
    plugins: [
        // other plugins
        ["split-brain", {disabled: true}]
    ]
}
```
Webpack will not split out new bundles for `Chunk`s, and all `Chunk`s will be loaded synchronusly. 
This is useful for testing, and for debugging issues that might be related to Webpack. 

## The Gory Details
Check out our [wiki](https://github.com/mprast/split-brain/wiki/The-Gory-Details) for details on what SplitBrain does behind the scenes.
