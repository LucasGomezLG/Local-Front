import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import API from '../service/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Swal from 'sweetalert2';
import Local from '../../Img/local.png';
import LocalAuto from '../../Img/localAuto.png';
import LocalRopa from '../../Img/localRopa.png';


class Locales extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      locales: [],
      idSet: '',
    }
  }


  componentDidMount() {

    API.get('/locales').then((res) => this.setState({ locales: res }))
      .catch((error) => console.log(error));

  }


  render() {
    return (
      <div>
        <div>
          <AppBar positon="static">
            <Toolbar>
              <Typography variant="h4" noWrap>
                Locales
              </Typography>
              <LocalOfferIcon className="ml-2" />
              <div className="ml-5">
                <Button variant="contained" color="secondary" className="ml-5" onClick={() => this.agregarLocal()}>
                  Agregar
              </Button>
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <div className=" container marginTopProd">
          {this.renderizarLocales()}
        </div>
      </div>
    )
  }

  renderizarLocales() {
    return (
      <div className="row">
        {this.state.locales.map((local) => this.transformarLocales(local))}
      </div>
    )
  }

  transformarLocales(local) {


    return (

      <div className="col-sm-5 col-md-5 col-lg-3 mt-2" key={local.id}>
        <Card>
          <CardActionArea onClick={() => this.setLocalId(local.id)}>
            <img src={this.imgLocales(local.categoria)} alt="asd" className="img-thumbnail" />
            <CardContent>
              <Typography variant="h5" component="h2">
                {local.nombre}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {local.descripcion}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Typography>
              {local.direccion}
            </Typography>
          </CardActions>
        </Card>
      </div>

    );
  }

  agregarLocal() {

    return (
      Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2', '3', '4']
      }).queue([
        {
          title: 'Categoria del local',
          text: '',
          input: 'radio',
          inputOptions: {
            'Autos': 'Autos',
            'Ropa': 'Ropa',
            'Otro': 'Otro'
          },
          inputValidator: (input) => {
            if (!input) {
              return 'Necesitas elegir una categoria!'
            }
          }
        },
        {

          title: 'Nombre del local',
          text: '',
          inputValidator: (text) => {
            if (!text) {
              return 'Necesitas agregar el nombre del local!'
            }
          }
        },
        {
          title: 'Descripcion del local',
          text: '',
          inputValidator: (text) => {
            if (!text) {
              return 'Necesitas agregar una descripcion al local!'
            }
          }
        },
        {
          title: 'Direccion del local',
          text: '',
          inputValidator: (text) => {
            if (!text) {
              return 'Necesitas agregar la direccion del local'
            }
          }
        }
      ]).then((result) => {
        if (result.value) {

          this.crearLocalNuevo(result.value);

          Swal.fire({
            title: 'Local listo!',
            html: ` Categoria: ${result.value[0]}<br />
                Nombre: ${result.value[1]}<br />
                Descripcion: ${result.value[2]} <br />
                Direccion: ${result.value[3]} <br />                  
                `,
            confirmButtonText: 'Listo!'
          })
        }
      })
    )
  }

  crearLocalNuevo(values){

    const body = {
      nombre: values[1],
      descripcion: values[2],
      direccion: values[3],
      categoria: values[0],
    }

    API.post('/addlocal', body)
      .then(() => this.componentDidMount())
      .catch((error) => console.log(error))


  }

  imgLocales(categoria) {

    if (categoria === "Autos") {
      return LocalAuto
    } else if (categoria === "Ropa") {
      return LocalRopa
    } else {
      return Local
    }
  }



  setLocalId(id) {
    this.setState({ idSet: id });
    setTimeout(() => {
      this.localProductos(this.state);
    }, 150);
  }

  localProductos(state) {

    this.props.history.push({

      pathname: '/productos',
      state: state,

    })

  }

}

export default Locales;