import axios from 'axios'

function kebabCaseToCamel(str) {
    return str.replace( /(\-\w)/g, (matches) => matches[1].toUpperCase())
}

class API {
    constructor({ url }){
        this.url = url
        this.endpoints = {}
    }
    /**
     * Create and store a single entity's endpoints
     * @param {A entity Object} entity
     */
    createEntity(entity) {
        /**
         * If there is a - in the entity.name, then change it
         * to camelCase. E.g
         * ```
         * myApi.createEntity({ name : 'foo-bar'})
         * myApi.endpoints.fooBar.getAll(...)
         */

        const name = kebabCaseToCamel(entity.name)
        this.endpoints[name] = this.createBasicCRUDEndpoints(entity)
    }

    createEntities(arrayOfEntity) {
        arrayOfEntity.forEach(this.createEntity.bind(this))
    }
    /**
     * Create the basic endpoints handlers for CRUD operations
     * @param {A entity Object} entity
     */
    createBasicCRUDEndpoints( { name } ) {
        var endpoints = {}

        const resourceURL = `${this.url}`

        //endpoints.hello = ({ params={}}, config={} ) => axios.get(resourceURL, { params }, config)

        endpoints.getAllSamples = () => axios.get(`${resourceURL}/samples`)

        endpoints.getOneUser = ({ id: uuid }, config={}) =>  axios.get(`${ this.url + '/samples'}/${uuid}`, config)

        endpoints.getOneProcess = ({ id: processName }, config={}) =>  axios.get(`${'/categories'}/${processName}`, config)

        return endpoints

    }

}

export default API