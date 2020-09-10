'use strict';

const useState = React.useState;
const useEffect = React.useEffect;
const e = React.createElement;
//e('', { : '' }, '')
let renderData_count = 1;
let searchData_count = 1;
let c=0
const Input = ({ label, type, input_id, setInputs, inputs, ...other }) => {
    const handleChange = e => {
        let text = e.target.value;
        setInputs(prev => {
            let temp = Object.assign({}, prev);
            temp[input_id] = text;
            return temp;
        });
        // ['name', 'date', 'title', 'field'].forEach(el => {
        //     if (el !== input_id) {
        //         setInputs(prev => {
        //             let temp = Object.assign({}, prev);
        //             temp[el] = '';
        //             return temp;
        //         });
        //     }
        // });
    };

    return e('div', { className: 'input-container' }, [
        e('label', null, label),
        e('input', {
            type: type,
            onChange: handleChange,
            value: inputs[input_id],
            ...other
        })
    ]);
};

const App = () => {
    const [searchData, setSearchData] = useState([]);
    const [renderData, setRenderData] = useState([]);
    const [searchProcess, setSearchProcess] = useState(false);
    const [inputs, setInputs] = useState({
        name: '',
        date: '',
        title: '',
        field: ''
    });
    const [searchResult, setSearchResult] = useState([]);
    const [renderMore, setRenderMore] = useState(false);
    const [bookmarkList, setBookmarkList] = useState({});

    useEffect(() => {
        if (renderMore) {
            if (searchProcess) {
                let temp = searchResult.slice(
                    searchData_count * 250,
                    searchData_count * 2 * 250
                );
                if (temp.length > 0) {
                    setSearchData(temp);
                    searchData_count = searchData_count + 1;
                }
            } else {
                let temp = data.slice(
                    renderData_count * 250,
                    renderData_count * 250 * 2
                );
                if (temp.length > 0) {
                    setRenderData(temp);
                    searchData_count = searchData_count + 1;
                }
                renderData_count = renderData_count + 1;
            }
            setRenderMore(false);
        }
    }, [renderMore]);

    useEffect(() => {
        searchProcess && setSearchData(searchResult.slice(0, 250));
    }, [searchResult]);

    useEffect(() => {
        search();
    }, [searchProcess]);

    useEffect(() => {
        const params = new URL(window.location).searchParams;
        if (params.toString() !== '') {
            ['name', 'date', 'title', 'field'].forEach(el => {
                if (params.get(el) !== null) {
                    setInputs(prev => {
                        return { ...prev, [el]: params.get(el) };
                    });
                    //setSearchKeyword({ key: el, value: params.get(el) });
                }
                setSearchProcess(true);
            });
        }
        setRenderData(data.slice(0, 250));

        document.addEventListener('scroll', () => {
            var topPos = document.documentElement.scrollTop;
            var remaining =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            var percentage = (topPos / remaining) * 100;
            if (percentage > 95) {
                setRenderMore(true);
            }
        });

        window.localStorage.getItem('bookmark') !== null &&
            setBookmarkList(
                JSON.parse(window.localStorage.getItem('bookmark'))
            );
    }, []);

    const bookmark = (e, id) => {
        setBookmarkList(prev => {
            return { ...prev, [id]: true };
        });
    };

    useEffect(() => {
        window.localStorage.setItem('bookmark', JSON.stringify(bookmarkList));
    }, [bookmarkList]);

    const render_table_row = array => {
        return array.map(el => {
            // console.log(bookmarkList[el.id])
            return e(
                'tr',
                {
                    key: el.id,
                    id: `_${el.id}`,
                    style: bookmarkList[el.id]
                        ? { backgroundColor: 'yellow' }
                        : null
                },
                [
                    e(
                        'td',
                        null,
                        e(
                            'button',
                            {
                                className: 'bookmark',
                                onClick: e => bookmark(e, el.id)
                            },
                            'bookmark'
                        )
                    ),
                    e('td', null, el.name),
                    e('td', null, el.date),
                    e('td', null, el.title),
                    e('td', null, el.field),
                    e('td', null, el.old_value),
                    e('td', null, el.new_value)
                ]
            );
        });
    };

    const search = () => {
        let filterResult = [...data];
        let searchFields = [];
        Object.keys(inputs).forEach(el => {
            if (inputs[el] !== '') {
                searchFields.push(el);
            }
        });
        searchFields.forEach(el => {
            if (el === 'date') {
                let bst = new BinarySearchTree();
                for (let i = 0; i < filterResult.length; i++) {
                    bst.insert(filterResult[i]);
                }
                filterResult = [...bst.search(inputs[el]).ads];
            } else {
                filterResult = [
                    ...filterResult.filter(ad =>
                        ad[el].toUpperCase().includes(inputs[el].toUpperCase())
                    )
                ];
            }
        });
        setSearchResult(filterResult);
    };

    const handleClick = e => {
        // searchData_count = 1;
        // setSearchProcess(true);
        // search();
        let params = {};
        Object.keys(inputs).forEach(el => {
            if (inputs[el] !== '') {
                params[el] = inputs[el];
            }
        });
        window.location.search = new URLSearchParams(params);
    };

    return e('div', { className: 'wrapper' }, [
        e('div', { className: 'inputs-wrapper' }, [
            e(Input, {
                input_id: 'name',
                label: 'نام تغییر دهنده',
                type: 'text',
                setInputs,
                inputs
            }),
            e(Input, {
                input_id: 'date',
                label: 'تاریخ',
                type: 'date',
                setInputs,
                inputs
            }),
            e(Input, {
                input_id: 'title',
                label: 'نام آگهی',
                type: 'text',
                setInputs,
                inputs
            }),
            e(Input, {
                input_id: 'field',
                label: 'فیلد',
                type: 'text',
                setInputs,
                inputs
            })
        ]),
        e(
            'div',
            { className: 'button-wrapper' },
            e(
                'button',
                {
                    onClick: handleClick
                    // disabled: searchKeyword.value === ''
                },
                'search'
            )
        ),
        e(
            'div',
            { className: 'table-container' },
            e('table', { className: 'table' }, [
                e(
                    'thead',
                    null,
                    e('tr', null, [
                        e('th', { key: 'th-6' }, 'نشان شده'),
                        e('th', { key: 'th-0' }, 'نام تغییر دهنده'),
                        e('th', { key: 'th-1' }, 'تاریخ'),
                        e('th', { key: 'th-2' }, 'نام آگهی'),
                        e('th', { key: 'th-3' }, 'فیلد'),
                        e('th', { key: 'th-4' }, 'مقدار قدیمی'),
                        e('th', { key: 'th-5' }, 'مقدار جدید')
                    ])
                ),
                e(
                    'tbody',
                    null,
                    searchProcess
                        ? render_table_row(searchData)
                        : render_table_row(renderData)
                )
            ])
        )
    ]);
};

const domContainer = document.querySelector('#root');
ReactDOM.render(e(App), domContainer);

//   useEffect(() => {
//     (function recurcive() {
//       setTimeout(() => {
//         setRenderData(data.slice(0, c * 1000 + 1000));
//         c = c + 1;
//         if (c < 100) {
//           recurcive();
//         }
//       }, 0);
//     })();
//   }, []);
