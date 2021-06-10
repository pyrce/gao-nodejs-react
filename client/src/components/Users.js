import React, {Component} from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Attributions from './Attributions';
import "../css/app.css";
import { IconButton, TextField } from '@material-ui/core';
const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

class postes extends Component {
    constructor() {
        super();
        this.state = {attributions:[], listepostes: [],date:new Date().toISOString().substr(0, 10),etat:false,show: false, pages:0,nomPoste:"",loading: true};
        this.getPostes=this.getPostes.bind(this);
        this.openModal=this.openModal.bind(this);
        this.closeModal=this.closeModal.bind(this);
        this.ajoutPoste=this.ajoutPoste.bind(this);
        this.update=this.update.bind(this);
        this.getByDate=this.getByDate.bind(this);
    }
    
    componentDidMount() {
        this.getPostes();
    }
    
    getPostes( page=0) {

       axios.post(`http://localhost:3000/postes`,{date:this.state.date,page:page}).then(postes => {

           var t=Object.keys(postes.data.postes).map((key) => postes.data.postes[key]);

           this.setState({ listepostes: t, loading: false,pages:postes.data.total})
      
           
       })
    }

    update(){
        this.setState({listepostes:[]});
this.getPostes();
        
    }
    getByDate(e){

this.setState({date:e.target.value});
this.getPostes();
    }
    openModal (e) {

        this.setState({ show: true });
   
      };
    
      closeModal ()  {
        this.setState({ show: false });
      };
    ajoutPoste(){
        axios({ 
            url:"http://localhost:3000/postes/add",
            method:"post",
            data:{ 
              nomPoste:this.state.nomPoste,
            } 
          }).then(msg=>{
            this.setState({ show: false });
            this.setState({listepostes:[]})
            this.getPostes();

          })
    }
    render() {
 let pages=[];
      for(let i=1;i<=this.state.pages;i++){
               pages.push(<IconButton aria-label="delete" onClick={ e=>this.getPostes( i)} color="primary">
              {i}
             </IconButton>);
           }
        return(
            <div>
               
                <section className="row-section">
                    <div className="container">
<div className="ajout">

                        <TextField
    id="date"
    label="jour"
    type="date"
    onChange={this.getByDate}
    className=" bg-light"
    InputLabelProps={{
        shrink: true,
      }}
  />

                        <button onClick={this.openModal} className="btn btn-info">Ajout poste</button>
                        </div>
                                <span className="pagination">
      {
     pages
        }
        </span>
                        {
                            <div className='listepostes'>
           <Modal isOpen={this.state.show} style={customStyles} onRequestClose={this.closeModal}>
          <button onClick={this.closeModal}>close</button>
          <input type="text" id="postes" onInput={(e)=>this.setState({nomPoste:e.target.value})}/>
  
          <button onClick={this.ajoutPoste}>ajouter</button>
        </Modal>

                
                      { 
                                this.state.listepostes.map(p =>
                                    <div className=" row-block card" key={p.id}>
                                    <div className="card-body">
                                            {p.nomPoste}
                                 
                                        
                                        <Attributions action={this.update} posteId={p.id} Attributions={p.attributions} />
                                       </div>   
                                      
                                    </div>
                                )
                                }
                            </div>
                        }
                    </div>
                </section>
            </div>
        )
    }
}
export default postes;