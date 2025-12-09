class ClientRequest {
    /**
     * Default = ''
     * Absolute = 'https://domain/path'
     * Relative to current schema = '//domain/path'
     * Relative to current path = 'path'
     * Relative to domain = '/path'
     * One level up = '../'
    */
    path = '';
    method = HttpMethod.GET;
    query = {};
    content = {};
}