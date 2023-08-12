import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import 'bootstrap/dist/css/bootstrap.min.css';

const ShowContacts = () => {
    var ruta = 'http://localhost:5000/contatos';
    const [contatos, setContatos] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [tablaContatos, setTablaContatos] = useState('');


    useEffect(() => {
        getContacts();
    }, []);

    const getContacts = async () => {
        ruta = 'http://localhost:5000/contatos?_sort=name';
        const respuesta = await axios.get(ruta);
        setContatos(respuesta.data);
        setTablaContatos(respuesta.data);
    }

    const handleChange=(e)=>{
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    const filtrar=(terminoBusqueda)=>{
        var resultadoBusqueda=tablaContatos.filter((elemento)=>{
            if(elemento.name.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())){
                return elemento;
            }
        });
        setContatos(resultadoBusqueda);
    }
    
    const enfocarBuscar= ()=> {window.setTimeout(function () {
        document.getElementById('pesquisar').focus();
    }, 500);}

    const openModal = (op, id, name, phone, email, address) => {
        setId('');
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setOperation(op);

        if (op === 1) {
            setTitle('Cadastrar Contato');
        }
        else if (op === 2) {
            setTitle('Editar Contato');
            setId(id);
            setName(name);
            setPhone(phone);
            setEmail(email);
            setAddress(address);
        }

        // hacer que se encienda el primer campo del formulario, Nome

        window.setTimeout(function () {
            document.getElementById('nome').focus();
        }, 500);
    }

    const validar = () => {
        var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        var parametros;
        var reg2 = /^\([0-9]{2}\) [0-9]?[0-9]{4}-[0-9]{4}$/
        var metodo;

        if (name.trim() === '') {
            show_alerta('Escreva seu nome', 'warning');
        }
        else if (phone.trim() === '') {
            show_alerta('Digite seu telefone', 'warning');
        }
        else if (reg2.test(phone) === false) {
            show_alerta('Digite seu telefone corretamente', 'warning');
        }
        else if (email.trim() === '') {
            show_alerta('Digite seu e-mail corretamente', 'warning');
        }
        else if (reg.test(email) === false) {
            show_alerta('Digite seu e-mail corretamente', 'warning');
        }
        else if (address.trim() === '') {
            show_alerta('Escreva seu endereço', 'warning');
        }
        else {
            if (operation === 1) {
                parametros = { id: id, name: name.trim(), phone: phone.trim(), email: email.trim(), address: address.trim() };
                metodo = 'POST';
                ruta = `http://localhost:5000/contatos`;
            }
            else {
                parametros = { id: id, name: name.trim(), phone: phone.trim(), email: email.trim(), address: address.trim() };
                metodo = 'PUT';
                ruta = `http://localhost:5000/contatos/${id}`;
            }
            enviarSolicitud(metodo, ruta, parametros);
        }
    }

    const enviarSolicitud = async (metodo, ruta, parametros) => {
        await axios({ method: metodo, url: ruta, data: parametros })
            .then(function (respuesta) {
                var tipo = respuesta.status;
                if (tipo === 200 || tipo === 201) {
                    document.getElementById('btnFechar').click();
                    enfocarBuscar();
                    getContacts();
                }
            })
            .catch(function (error) {
                show_alerta('Error na solicitud', 'error');
                console.log(error);
            })
    }

    const deleteContato = (id, name) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: 'Você tem certeza que deseja excluir o contato ' + name + ' ?',
            icon: 'question', text: 'Você não será capaz de voltar atrás',
            showCancelButton: true, confirmButtonText: 'sim, excluir', cancelButtonText: 'cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                ruta = `http://localhost:5000/contatos/${id}`;
                enviarSolicitud('DELETE', ruta, { id: id });
            }
            else {
                show_alerta('O contato não foi excluido', 'info');
            }
        });
    }

    const creditosCreador = () => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: 'Criado por Cherry Machado',
            icon: 'success', text: 'Instituto TOTTI, Turma 31. Curso Programador Full Stack.'+' \xA9 '+'2023. Todos os dereitos reservados.',
            confirmButtonText: 'Voltar'
        })
    }

    return (
        <div className='App'>
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalContacts">
                                <i className='fa-solid fa-circle-plus'></i> Cadastre o novo contato
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <div className="input-group mb-3">
                                    <span className="input-group-text"><i className='fa-solid fa-magnifying-glass'></i></span>
                                <input type="text" id='pesquisar' className='form-control' placeholder='Pesquisar Contatos' value={busqueda} onChange={handleChange}/>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                        <button onClick={() => creditosCreador()} className="btn btn-success">
                           <i className="fa-solid fa-user"></i> Créditos
                        </button>
                        </div>
                    </div>

                </div>
                
                <div className="row mt-3">
                    <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                        <div className="table-responsive">
                            <table className='table table-bordered'>
                                <thead>
                                    <tr><th>Nro</th><th>Nome</th><th>Telefone</th><th>Email</th><th>Endereço<th></th></th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {contatos.map((contato, i) => (
                                        <tr key={contato.id}>
                                            <td>{(i + 1)}</td>
                                            <td>{contato.name}</td>
                                            <td>{contato.phone}</td>
                                            <td>{contato.email}</td>
                                            <td>{contato.address}</td>
                                            <td>
                                                <button onClick={() => openModal(2, contato.id, contato.name, contato.phone, contato.email, contato.address)}
                                                    className="btn btn-warning" data-bs-toggle='modal' data-bs-target='#modalContacts'>
                                                    <i className="fa-solid fa-edit"></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteContato(contato.id, contato.name)} className="btn btn-danger">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                      ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalContacts' className="modal fade" aria-hidden='true'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{title}</label>
                            <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id='id'></input>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className='fa-solid fa-gift'></i></span>
                                <input type="text" id='nome' className='form-control' placeholder='Nome' value={name}
                                    onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className='fa-solid fa-phone'></i></span>
                                <input type="text" id='phone' className='form-control' placeholder='(11) 9xxxx-xxxx' value={phone}
                                    onChange={(e) => setPhone(e.target.value)}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className='fa-solid fa-envelope'></i></span>
                                <input type="text" id='email' className='form-control' placeholder='Email' value={email}
                                    onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className='fa-solid fa-home'></i></span>
                                <input type="text" id='address' className='form-control' placeholder='Endereço' value={address}
                                    onChange={(e) => setAddress(e.target.value)}></input>
                            </div>
                            <div className="d-grid col-6 mx-auto">
                                <button onClick={() => validar()} className="btn btn-success">
                                    <i className="fa-solid fa-floppy-disk"></i> Salvar
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={()=>enfocarBuscar()} id='btnFechar' type='button' className="btn btn-secondary" data-bs-dismiss='modal'>Fechar</button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default ShowContacts

