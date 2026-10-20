const express = require('express')
const knex = require('knex')
const http_errors = require('http-errors')

const PORT = 8001
const HOSTNAME = "localhost"

const api = express()
api.use( express.json() )
api.use( express.urlencoded( { extended : true } ) )

// Criar a conexão com o banco bd_dsapi
const conn = knex( {
    client : "mysql" ,
    connection : {
        host : HOSTNAME ,
        user : "root" ,
        password : "" ,
        database : "bd_dsapi"
    }
} )

// Construção dos endpoints
api.get( '/' , (req, res, next)=>{
    res.status( 200 )
    //    res.send( '{ "resposta" : "Seja bem-vindo(a) à nossa API" }' )
    res.json( { resposta : "Seja bem-vindo(a) à API da Loja Online" } )
} )


/* product */
api.get( '/product' , (req, res, next)=>{
    conn("produtos")
        .join( "categorias" , "produtos.categoria_id" , "=" , "categorias.id")
        .select( "produtos.*" , "categorias.nome AS categoria_nome" )
        .orderBy( "produtos.nome" )
        .then( (dados) => {
            res.status( 200 )
            res.json( dados )
        } )
        .catch( next )
} )

api.get( '/product/:idProd' , (req, res, next)=>{
    const idProduto = req.params.idProd
    conn("produtos")
        .join( "categorias" , "produtos.categoria_id" , "=" , "categorias.id")
        .select( "produtos.*" , "categorias.nome AS categoria_nome" )
        .where( "produtos.id" , idProduto )
        .first()
        .then( (dados) => {
            res.status( 200 )
            res.json( dados )
        } )
        .catch( next )
} )

api.post( '/product' , (req, res, next)=>{
    conn("produtos")
        .insert( req.body )
        .then( (dados) => {
            if( !dados ){
                return next( http_errors( 404 , "Erro ao inserir produto" ) )
            }
            res.status( 201 )
            res.json( { resposta : "Produto inserido!" , id : dados[0] } )
        } )
        .catch( next )
} )

api.put( '/product/:idProd' , (req, res, next)=>{
    const idProduto = req.params.idProd
    conn("produtos")
        .where( "id", idProduto )
        .update( req.body )
        .then( (dados) => {
            if( !dados ){
                return next( http_errors( 404 , "Erro ao editar produto" ) )
            }
            res.status( 200 )
            res.json( { resposta : "Produto editado!" } )
            //res.json( dados )
        } )
        .catch( next )
} )

api.delete( '/product/:idProd' , (req, res, next)=>{
    const idProduto = req.params.idProd
    conn("produtos")
        .where( "id", idProduto )
        .delete()
        .then( (dados) => {
            if( !dados ){
                return next( http_errors( 404 , "Erro ao excluir produto" ) )
            }
            res.status( 200 )
            res.json( { resposta : "Produto excluído!" } )
        } )
        .catch( next )
} )

/* category */

.get( '/category' , (req, res, next)=>{
    conn("categorias")
        .select( "*" )
        .orderBy( "nome" )
        .then( (dados) => {
            res.status( 200 )
            res.json( dados )
        } )
        .catch( next )
} )

api.get( '/category/:idCat' , (req, res, next)=>{
    const idCat = req.params.idCat
    conn("categorias")
        .select( "*" )
        .where( "id" , idCat )
        .first()
        .then( (dados) => {
            res.status( 200 )
            res.json( dados )
        } )
        .catch( next )
} )

api.post( '/category' , (req, res, next)=>{
    conn("categorias")
        .insert( req.body )
        .then( (dados) => {
            if( !dados ){
                return next( http_errors( 404 , "Erro ao inserir categoria" ) )
            }
            res.status( 201 )
            res.json( { resposta : "Categoria inserida!" , id : dados[0] } )
        } )
        .catch( next )
} )

api.put( '/category/:idCat' , (req, res, next)=>{
    const idCat = req.params.idCat
    conn("categorias")
        .where( "id", idCat )
        .update( req.body )
        .then( (dados) => {
            if( !dados ){
                return next( http_errors( 404 , "Erro ao editar categoria" ) )
            }
            res.status( 200 )
            res.json( { resposta : "Categoria editada!" } )
        } )
        .catch( next )
} )

api.delete( '/category/:idCat' , (req, res, next)=>{
    const idCat = req.params.idCat
    conn("categorias")
        .where( "id", idCat )
        .delete()
        .then( (dados) => {
            if( !dados ){
                return next( http_errors( 404 , "Erro ao excluir categoria" ) )
            }
            res.status( 200 )
            res.json( { resposta : "Categoria excluída!" } )
        } )
        .catch( next )
} )


/* client*/

api.get( '/client' , (req, res, next)=>{
    conn("clientes")
        .join( "cidades", "clientes.cidade_id", "=", "cidades.id" )
        .select( "clientes.*", "cidades.nome AS cidade_nome" )
        .then( (dados) => {
            res.status( 200 )
            res.json( dados )
        } )
        .catch( next )
} )

api.post( '/client' , (req, res, next)=>{
    conn("clientes")
        .insert( req.body )
        .then( (dados) => {
            if( !dados ){
                return next( http_errors( 404 , "Erro ao cadastrar cliente" ) )
            }
            res.status( 201 )
            res.json( { resposta : "Cliente cadastrado com sucesso!" , id : dados[0] } )
        } )
        .catch( next )
} )


// Colocando o servidor no ar
api.listen( PORT , ()=>{
    console.log( `API rodando em http://${HOSTNAME}:${PORT}` )
} )