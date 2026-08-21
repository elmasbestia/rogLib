/*
    crea Esquema

        Crea un esquema de datos de formato GraphQL a partir del esquema de datos:

        Hoja "Tablas" (Lista de las Tablas de la BD)
        Tablas, Descripcion, Observacion, Relacionada con

        Las otras hojas corresponden a cada tabla
        El nombre de la hoja es el de la tabla y y las columnas son:
        nbCampo, tipo, largo, observacion

        Material de apoyo:
        https://www.youtube.com/watch?v=H8YnVk2vhzg

	Cada Hoja en el libro XL tiene la lista de sus campos con:
	1. nombre	
	2. tipo	
	3. tamano	
	4. descripcion	
	5. fuente

*/

/*
    Schema tiene Query y Mutation

    Ambos son Object Type y sus elementos son
    Los diferentes tipos en el caso de Query
    y las operaciones sobre esos tipos en el caso de Mutation

    Para cada Tabla debemos definir:
    tablaTipo (El arquetipo)
    tabla (Cómo acceder un registro de ese tipo)
    tablas (Cómo acceder un conjunto de ese tipo (GraphQLList)

    Además, todas los métodos y accesos particulares que queramos para ese tipo en particular
*/

/*
    enum EdoCivil {
        casad@,
        solter@,
        divorciad@,
        Unid@,
        Viud@
    }
*/

function declaraciones() {
    return `const graphql = require("graphql");
            import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:8000'

const { 
    objTipo: GraphQLObjectType, 
    texto:   GraphQLString, 
    esquema: GraphQLSchema, 
    id:      GraphQLID,
    entero:  GraphQLInt,
    lista:   GraphQLList,
    noNulo:  GraphQLNonNull
} = graphql;

`}

function defTipo(tabla,Campos) {
    return `${tabla.nb}Type = new objTipo({
	name: "${nbTabla}",
    description: "${tabla.descripcion}",
    args: {
        id: {type: GraphQLInt},
        titulo: 
    },
	fields: () => {{
        ${Campos.map(defCampo).join()}
	}}
})
`}

function defCampo (campo) {
	return `${campo.nombre}: {type: ${campo.tipo}}`
/*
if campo.requerido nonNull(tipo)
else tipo

    `id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    books: {
        type: new GrapQLList(BookType),
        resolve(parent,args){
            
        }
    }
`
*/
}

/*
AuthorType = new GrapQLObjectType({
	name: "Book",
	fields: () => {{
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		age: {type: GraphQLInt},
		books: {
			type: new GrapQLList(BookType),
			resolve(parent,args){
				
			}
		}
	}}
})

const PersonType = new GrapQLObjectType({
	fields: () => ({
		firstName: {
			type: GrapQLString,
			resolve: (person) => person.first_name
		},
		lastName: {
			type: GrapQLString,
			resolve: (person) => person.last_name
		},
		email: { type: GrapQLString },
		username: { type: GrapQLString },
		id: { type: GrapQLString },
		friends: new GrapQLList(PersonType), 
			resolve: () =>
	})
})
*/

/*
const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: '...',

	fields: () => ({
		person: {
			type: PersonType,
			args: {
				id: { type: GraphQLString }
			},
			resolve: (root,args) => fetch({'${BASE_URL}/people/${args.id}/')
			.then(res =>res.json())
			.then(json => json.person)
		}
*/

function defQuery() {
return `const RootQuery = new GrapQLObjectType({
    name: 'RootQueryType',
    fields: {
        << tablas >>
    }
})
`}

function defAccTabla() {
    return `
    book: {
        type: BookType,
        args: { id: {type: GraphQLNonNull(GraphQLString)},
        },
        resolve (parent, args) {
            return args.id
        }
    },
    books: {
        type: new GraphQLList(BookType),
        args: ,
        resolve (parent,args) {
            return 
        }
    },
`}

function putacion() {
    return `const Mutation = new GraphQLObjectType({
        name: "Mutation",
        fields: {
            addAuthor {
                type: AuthorType,
                description: "Add a Book",
                fields: {
                    name: { type: NonNull(GraphQLstring)},
                    authorId: {type: GraphQLNonNull(GraphQLInt)}
                },
                resolve(parent,args) {
                    let author = new Author({
                        name: args.name,
                    })
                    author.save
                }
            }
        }
    })`
}

function debut() {
    return ``
}

function finale() {
return `module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})
`}

function defFuncion() {
    return `function getPersonByURL(relativeURL) {
        return fetch('${BASE_URL}${relativeURL}')
        .then(res => res.json())
        .then(json => json.person)
    }
`}


const xl = require("./rogXL");
const bd = new xl.Libro("C:/Users/Rafa/Dropbox/proyectos/(Durmientes)/NomPack/Apoyo/Nompack BD.xlsx");

creaDicc();

function creaEsquema() {
    let texto = "" 

    bd.recorre(hoja => {
        texto += defTabla(hoja.nb, hoja.recorre(defCampo))
    })

    guardArch("esquema.txt",texto);
}

function creaDicc() {
    let dicc = {}

    bd.recorre(hoja => {
        dicc[hoja.nb] = xl.lib.sheet_to_row_object_array(hoja.celdas)
    })

    guardArch("diccNomPack.json",JSON.stringify(dicc));
}

function guardArch(nbArch,contenido) {
    const fs = require("fs");

    fs.writeFileSync(nbArch,contenido)
}

/*
const graphql = require("graphql")

const { 
objTipo: GraphQLObjectType, 
texto:   GraphQLString, 
esquema: GraphQLSchema, 
id:      GraphQLID,
entero:  GraphQLInt,
lista:   GraphQLList,
noNulo:  GraphQLNonNull
} = graphql;

BookType = new GrapQLObjectType({
	name: "Book",
	fields: () => {{
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		genre: {type: GraphQLString},
		author: {
			type: AuthorType,
			resolve (book,args) {
				return author, {id: book.authorId}
			}
		}
	}}
})

AuthorType = new GrapQLObjectType({
	name: "Book",
	fields: () => {{
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		age: {type: GraphQLInt},
		books: {
			type: new GrapQLList(BookType),
			resolve(parent,args){
				
			}
		}
	}}
})

const RootQuery = new GrapQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: {type: GraphQLNonNull(GraphQLString)},
			},
			resolve (parent, args) {
				return args.id
			}
		},
		author {
			type: AuthorType,
			args: { id: {type: GraphQLID}},
			resolve (parent, args) {
				return 
			}
		},
		books: {
			type: new GraphQLList(BookType),
			args: ,
			resolve (parent,args) {
				return 
			}
		},
		Authors: {
			type: new GraphQLList(BookType),
			args: ,
			resolve (parent,args) {
				return 
			}
		}
	}
}
)

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addAuthor {
			type: AuthorType,
			args: {
				name: 
			},
			resolve(parent,args) {
				let author = new Author({
					name: args.name,
				})
				author.save
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})
*/

/*
esquema:
    query: new GraphQLObjectType({
        name: "Saludo",
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => "Hello World!"
            }
        })
    })

app.use("/graphql", expressGraphQL({
    schema: ,
    graphql: true
}))
*/

/*
	Segmentar:

	const graphql
	
	tipos = graphql
	
	const tipo = new GraphQLObjectType
	
	module.exports = tipo
	
	
	Index.js en Esquemas:
	
	const graphql
	
	tipos = graphql
	
	const tipo = require()
	
	blah, blah
	
	module.exports = new GraphQLSchema({ query: , mutation: })
	
	
*/
	