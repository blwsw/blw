
export default {
	provide(){
        return{
            reload:this.onSearch
        }
    },
    components: {
    },

    async created() {
        // this._jump(() => this.paginator.first());
        //
        // this.roleOptions = await this.$hd.api.get({
        //     url: '/uc/users/factory/role'
        // });
    },

    computed: {
        paginator() {
            // if(!this.filters.sort) {
            //     this.filters.sort = '-createDatetime';
            // }
            // const user = JSON.parse(localStorage.getItem('user'));
            // this.userType = user.userType;
            // this.filters.curruserType = user.userType;
            // const p  = this.$hd.paginator({
            //     url: '/uc/users',
            //     params: this.filters,
            // });
            //
            // return p;
        },
    },

    data() {
        return {
            columns: [
                {
                    label: '用户名',
                    prop: 'userName',
                    align:"center",
                },
                {
                    label: '名称',
                    prop: 'name',
                    align:"left",
                },
                {
                    label: '用户类型',
                    prop: 'userType',
                    align:"center",
                },
                {
                    label: '企业',
                    prop: 'enterpriseName',
                    align:"left",
                },
                {
                    label: '工厂',
                    prop: 'factoryName',
                    align:"left",
                },
                // {
                //     label: '部门',
                //     prop: 'deptName',
                //     align:"left",
                // },
                {
                    label: '所属食堂',
                    prop: 'canteens',
                    align:"left",
                },
                {
                    label: '归属车间',
                    prop: 'cjName',
                    align:"left",
                },
				// {
				//     label: '管理车间',
				//     prop: 'cjs',
				//     align:"left",
				// },
            ],
            options: [{
                value: 'PM',
                label: 'PM'
            }, {
                value: 'FM',
                label: 'FM'
            }, {
                value: 'SM',
                label: 'SM'
            }],
            dataset: [],
            filters: {},
            isAdvancedSearch: false,
            selectedPermissions: [],
            roleOptions: [],
            canupdate:false,
            userType:"",
        };
    },

    methods: {
        async onClickDelete() {
            try {
                await this.$confirm(
                    '确定要删除吗？',
                    '提示',
                    {type: 'warning'},
                );

                await this.$hd.runAsync(async (options) => {
                    options.loadingMsg = '正在删除，请稍候...';
                    options.showOk = true;
                    options.okMsg = '删除成功！';
                    options.errorMsg = ({message}) => `删除失败: ${message}`;

                    const data = this.selectedPermissions[0];

                    const del = () => this.$hd.api.delete({
                        url: 'uc/users/:id',
                        params: {id: data.id},
                    });

                    await del();
                    // const i = this.dataset.indexOf(data);
                    // this.dataset.splice(i, 1);
                    this.filters = {};
                    if(!this.filters.sort) {
                        this.filters.sort = '-createDatetime';
                    }
                    this.filters.curruserType = this.userType;
                    this._jump(() => this.paginator.first());
                });
            }
            catch {
                // 什么也不做
            }
        },

        async onClickNew() {

            const updatedData = await this.$refs.popupCreate.open(this.roleOptions);

            if (updatedData) {
                this.filters = {};
                if(!this.filters.sort) {
                    this.filters.sort = '-createDatetime';
                }
                this.filters.curruserType = this.userType;
                this._jump(() => this.paginator.first());
            }
        },

        async onClickEdit() {
            const data = this.selectedPermissions[0];
            const updatedData = await this.$refs.popupUpdate.open(data, this.roleOptions);

            if (updatedData) {
                this.filters = {};
                if(!this.filters.sort) {
                    this.filters.sort = '-createDatetime';
                }
                this.filters.curruserType = this.userType;
                this._jump(() => this.paginator.first());
            }
        },
        async onClickCanteenPick() {

            const data = this.selectedPermissions[0];
            const canteenItems = await this.$hd.api.get({
                url: '/core/canteens'
            });
            const hasCanteens = data.sysUserCanteens;
            await this.$refs.popupCanteenPick.open(data, canteenItems, hasCanteens);
        },

		async onClickCheJianPick() {
		    const data = this.selectedPermissions[0];
		    await this.$refs.popupCheJianPick.open(data);
            this._jump(() => this.paginator.first());
		},

        onSearch() {
            this._jump(() => this.paginator.first());
        },

        onResetSearch() {
            this.filters = {};
            this.filters.curruserType = this.userType;
            this._jump(() => this.paginator.first());
        },

        onSelectPermissions(permissions) {
            this.selectedPermissions = permissions;
            if(permissions && permissions[0]){
                const user = JSON.parse(localStorage.getItem('user'));
                if(user.userType == this.selectedPermissions[0].userType && user.userType =="PM"){
                    this.canupdate = true;
                }else {
                    this.canupdate = false;
                }
            }

        },

        onChangeSort({prop, order}) {
          //  console.log(prop, order);
        },

        onChangePageSize(pageSize) {
            this.paginator.pageSize = pageSize;
            this._jump(() => this.paginator.first());
        },

        onClickPrev() {
            this._jump(() => this.paginator.prev());
        },

        onClickNext() {
            this._jump(() => this.paginator.next());
        },

        onChangeCurrent(current) {
            this._jump(() => this.paginator.goto(current));
        },

        _jump(fn) {
          //   this.$hd.runAsync(async (options) => {
          //       options.loadingMsg = '正在加载数据，请稍候...';
          //       options.errorMsg = ({message}) => `加载数据失败: ${message}`;
          //       const permissions = await fn();
          //
          //       const refine = ({
          //           id,
          //           userName,
          //           name,
          //           userType,
          //           enterpriseName,
          //           factoryName,
          //           deptName,
          //           roleRecs,
          //           canteens,
          //           sysUserCanteens,
          //           cjName,
          //           cjno,
					// cjs,
          //           cjnos
          //       }) => {
          //           return {
          //               id,
          //               userName,
          //               name,
          //               userType,
          //               enterpriseName,
          //               factoryName,
          //               deptName,
          //               roleRecs,
          //               canteens,
          //               sysUserCanteens,
          //               cjName,
          //               cjno,
					// 	cjs,
          //               cjnos
          //           };
          //       };
          //
          //       this.dataset = permissions.map(refine);
          //   });
        },

        //onFetch(permissions) {
            //const refine = ({
                //code,
                //dataPermOptions,
                //id,
                //moduleId,
                //name,
                //router,
                //tips,
                //type,
            //}) => {
                //return {
                    //code,
                    //dataPermOptions,
                    //id,
                    //moduleId,
                    //name,
                    //router,
                    //tips,
                    //type,
                //};
            //};

            //this.dataset = permissions.map(refine);
        //},
    },
}
