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


        endpoints.getAllSamples = ({token}) => axios.get(`${resourceURL}/samples?token=${token}`)

        endpoints.getOneUser = ({ uuid }, {token}) =>  axios.get(`${resourceURL}/samples/${uuid}?token=${token}`)

        endpoints.getOneProcess = ({ processName }, {token}) =>  axios.get(`${resourceURL}/categories/${processName}?token=${token}`)

        endpoints.sunburstData = function ({ uuid }, { start_timestamp }, { end_timestamp }, {token}) {
            var urll = `${resourceURL}/sunburst-data/${uuid}?token=${token}`;

            if (start_timestamp !== undefined) {
                urll = urll + `&start=${start_timestamp}`
            }
            if (end_timestamp !== undefined) {
                urll = urll + `&end=${end_timestamp}`
            }

            const response = axios.get(urll)
            return response
        }

        endpoints.anomalyData = function ({ uuid }, { start_timestamp }, { end_timestamp }, {token}) {
            var urll = `${resourceURL}/anomalies/${uuid}?token=${token}`;

            if (start_timestamp !== undefined) {
                urll = urll + `&start=${start_timestamp}`
            }
            if (end_timestamp !== undefined) {
                urll = urll + `&end=${end_timestamp}`
            }

            const response = axios.get(urll)
            return response
        }

        endpoints.username = function ({ username }) {
            var urll = `${resourceURL}/users/${username}?`;

            const response = axios.get(urll)
            return response
        }

        return endpoints

    }

}

export default API
