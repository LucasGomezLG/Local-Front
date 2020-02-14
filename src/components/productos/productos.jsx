import React from 'react';
import API from '../service/api';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import Typography from '@material-ui/core/Typography';
import Swal from 'sweetalert2';
import TextField from '@material-ui/core/TextField';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SearchIcon from '@material-ui/icons/Search';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

class Productos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productos: [],
      productosFiltrados: [],
      stock: '',
      idLocal: '',
    };

  }

  componentDidMount() {

    this.setState({ idLocal: this.props.location.state.idSet })

    const paramReq = {
      id: this.props.location.state.idSet
    }

    API.get('/productosById', paramReq).then((res) => this.setState({ productos: res, productosFiltrados: res }))
      .catch((error) => console.log(error));


  }


  render() {
    return (
      <div>
        <div>
          <AppBar positon="static">
            <Toolbar>
              <Typography variant="h4" noWrap>
                Productos
              </Typography>
              <LocalGroceryStoreIcon className="ml-2" />
              <Button variant="contained" color="secondary" className="ml-5" onClick={() => this.handleAdd()} >
                Agregar
              </Button>
              <div className="marginBotDrop">
                <TextField label="Buscar por nombre" color="secondary" onChange={(e) => this.textBuscador(e)} />
                <SearchIcon className="searchAlign" />
              </div>
              <div className="marginBotDrop" >
                {this.dropDown()}
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <div className="container marginTopProd">
          {this.renderizarProductos()}
        </div>
        <div className=" col-2 container marginTopProd">
          <Button variant="contained" color="secondary" className="ml-5" onClick = {() => this.volver()}>
            Volver
          </Button>
        </div>
      </div>
    )
  }

  renderizarProductos() {
    return (
      <div className="row">
        {this.state.productosFiltrados.map((producto) => this.transformarProducto(producto))}
      </div>
    )
  }

  transformarProducto(producto) {

    return (

      <div className="col-sm-5 col-md-5 col-lg-3 mt-2" key={producto.id}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={this.avatarBackgroud(producto.cantidad)}>
                {this.avatar(producto.marca)}
              </Avatar>
            }
            title={producto.marca}
            subheader={"Cantidad: " + producto.cantidad}
          />
          <CardContent>
            <div className="text-center" >
              <Typography variant="body2" color="textSecondary" component="p">
                {producto.descripcion}
              </Typography>
            </div>
          </CardContent>
          <CardActions>
            <Typography variant="body2" color="textSecondary" component="p">
              <MonetizationOnIcon></MonetizationOnIcon>
              {producto.precio}
            </Typography>
            <Button color="secondary" onClick={() => { this.eliminarProd(producto.id) }}>
              Eliminar
            </Button>
          </CardActions>
        </Card>
      </div>
    )

  }

  handleAdd() {
    return (

      Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2', '3', '4']
      }).queue([
        {

          title: 'Producto',
          text: '',
          inputValidator: (text) => {
            if (!text) {
              return 'Necesitas agregar la marca del producto!'
            }
          }

        },
        {
          title: 'Descripcion de el producto',
          text: '',
          inputValidator: (text) => {
            if (!text) {
              return 'Necesitas agregar una descripcion al producto!'
            }
          }
        },
        {
          title: 'Precio del producto',
          text: '',
          input: 'number',
          inputValidator: (text) => {
            if (!text) {
              return 'Necesitas agregar el precio del producto!'
            }
          }
        },
        {
          title: 'Cantidad de productos',
          text: 'Campo vacio es igual a 0 productos',
          input: 'number'
        }
      ]).then((result) => {
        if (result.value) {
          this.crearProductoNuevo(result.value);
          this.avatarBackgroud(result.value[3]);

          Swal.fire({
            title: 'Producto listo!',
            html: ` Marca: ${result.value[0]}<br />
                  Descripcion: ${result.value[1]}<br />
                  Precio: ${result.value[2]} <br />
                  Cantidad: ${result.value[3]} <br />                  
                  `,
            confirmButtonText: 'Listo!'
          })
        }
      })
    )
  }

  crearProductoNuevo(valores) {

    const body = {
      marca: valores[0],
      descripcion: valores[1],
      precio: valores[2],
      cantidad: valores[3],
      id_local: this.state.idLocal,
    }

    API.post('/addProducto', body)
      .then(() => this.componentDidMount())
      .catch((error) => console.log(error))

  }

  eliminarProd(id) {

    Swal.fire({
      title: '¿Seguro quieres eliminar el producto?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          '!Producto eliminado!',
          '',
          'success'
        )

        API.post(`/producto/${id}`).then((res) => this.componentDidMount()).catch((error) => console.log(error));
      }
    })


  }

  avatar(marca) {

    return (
      marca.charAt(0).toUpperCase()
    )

  }

  avatarBackgroud(cantidad) {

    if (cantidad <= 10) {
      return (
        "bg-danger"
      )
    } else if (cantidad > 10 && cantidad < 50) {
      return (
        "bg-warning"
      )
    } else {
      return (
        "bg-success"
      )
    }
  }

  dropDown() {

    return (

      <Dropdown>
        <Dropdown.Toggle>
          Filtrar strock
      </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => this.todos()}>Todos</Dropdown.Item>
          <Dropdown.Item onClick={() => this.sinStock()}>Sin stock</Dropdown.Item>
          <Dropdown.Item onClick={() => this.baja()}>Baja</Dropdown.Item>
          <Dropdown.Item onClick={() => this.media()}>Media</Dropdown.Item>
          <Dropdown.Item onClick={() => this.alta()}>Alta</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

    )

  }

  todos() {
    this.setState({ productosFiltrados: this.state.productos });
  }
  sinStock() {
    this.setState({ productosFiltrados: this.state.productos.filter((producto) => producto.cantidad === 0) });
  }
  baja() {
    this.setState({ productosFiltrados: this.state.productos.filter((producto) => producto.cantidad <= 10 && producto.cantidad > 0) });
  }
  media() {
    this.setState({ productosFiltrados: this.state.productos.filter((producto) => producto.cantidad > 10 && producto.cantidad <= 50) });
  }
  alta() {
    this.setState({ productosFiltrados: this.state.productos.filter((producto) => producto.cantidad > 50) });
  }

  textBuscador(e) {

    if (e.target.value !== '') {
      this.setState({ productosFiltrados: this.state.productosFiltrados.filter((productos) => productos.marca.toLowerCase().includes(e.target.value.toLowerCase())) });
    } else {
      this.setState({ productosFiltrados: this.state.productos })
    }
  }

  volver() {

    this.props.history.push({

      pathname: '/locales'

    })

  }


}

export default Productos;