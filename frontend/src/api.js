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


        endpoints.getAllSamples = () => axios.get(`${resourceURL}/samples`)

        endpoints.getOneUser = ({ uuid } ) =>  axios.get(`${resourceURL}/samples/${uuid}`)

        endpoints.getOneProcess = ({ processName } ) =>  axios.get(`${resourceURL}/categories/${processName}`)

        endpoints.sunburstData = function ({ uuid}, {start_timestamp}, {end_timestamp}) { 
            var urll = `${resourceURL}/sunburst/?uuid=${uuid}`;
            if (start_timestamp !== undefined) {
                urll = urll + `&start=${start_timestamp}`
            }
            if (end_timestamp !== undefined) {
                urll = urll + `&end=${end_timestamp}`
            }
            axios.get(urll)
        }
        return endpoints

    }

}

export default API