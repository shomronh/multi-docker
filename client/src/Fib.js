import React, { Component } from 'react'
import axios from 'axios'

class Fib extends Component{
  
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  }

  componentDidMount(){
    this.fetchValues()
    this.fetchIndexes()
  }

  async fetchValues(){
    const values = await axios.get('/api/values/current')
    this.setState({ values: values.data })
  }

  async fetchIndexes(){
    const seendIndexes = await axios.get('/api/values/all')
    this.setState({ seenIndexes: seendIndexes.data })
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    await axios.post('/api/values', {
      index: this.state.index
    })
    this.setState({ index: '' })
  } 

  renderSeendIndexes(){
    return this.state.seenIndexes.map( ({number}) => number).join(', ')
  }

  renderValues(){

    // when we pull data our of Redis we'll actually get back and object
    // that's going to have a bunch of key value pairs inside of it

    const entries = []
    for(let key in this.state.values){
      entries.push(
        <div key={key}>
          For index {key} i Calculated {this.state.values[key] }
        </div>
      )
    }

    return entries
  }

  

  render(){
   return(
     <div>
       <form onSubmit={this.handleSubmit}>
         <label>Enter Your index:</label>
         <input
          value={this.state.index}
          onChange={
            event => this.setState({ index: event.target.value })
          }
         />
         <button>Submit</button>
       </form>

       <h3>Indexes i have seen:</h3>
       { this.renderSeendIndexes() }

       <h3>Calculated values:</h3>
       { this.renderValues() }
     </div>
   ) 
  }
}


export default Fib