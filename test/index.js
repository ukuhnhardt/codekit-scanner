var     expand  =   require('../.')
    ,   expect  =   require('expect.js')
    ;


describe("codekit scanner test", function(){
    it('should scan codekit-prepends', function(done){
        this.timeout(10000);
        expand({file: 'test/js/core.js', fw: 'test/framework', jsDir : 'test/js'}, function(files){
            console.log('files',files);
            expect(files).to.contain('test/js/core.config.js');
            expect(files).to.contain('test/framework/js/framework.file.js');
            expect(files).to.contain('test/framework/js/framework.utilities.js');
            done();
        });

    });
    it('should scan codekit-appends', function(done){
        this.timeout(10000);
        expand({file: 'test/js/core.js', fw: 'test/framework', jsDir : 'test/js'}, function(files){
            console.log('files',files);
            expect(files).to.contain('test/js/modules/module.js');
            expect(files).to.contain('test/js/views/view.js');
            done();
        });

    })
});
