# split-brain
Easy, declarative code splitting in React &amp; webpack.

**NOTE: you need to install [babel-plugin-split-brain](https://github.com/mprast/babel-plugin-split-brain) and add it to 
your .babelrc if you're going to use this.**

## What Does this Package Do
Webpack has built-in support for [code splitting](https://webpack.github.io/docs/code-splitting.html). This is cool, but the 
syntax for lazy-loading code is kind of awkward when used with react (what with the `require.ensure` and the async and all). 
SplitBrain takes away a lot of that boiler plate by giving you a `Chunk` element you can use to create a lazy-loaded component.

So, for example, if you did:
```
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
Easy peasy!

## In-depth Usage
Put whatever you want inside of SplitBrain. Have nested elements or an expression container:

```
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

Just remember that *SplitBrain accepts one and only one child*.

