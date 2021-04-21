const tempData = [
    {   
        lotNumber: 'PRO201908961663',
        projectName: 'Lot 19 Plantation Grove Master',
        address: '225 Plantation Grove Dr.',
        permitDate: '04-09-2020',
        coDate: '04-09-2020',
        closedDate: '04-09-2020'
    },
    {   
        lotNumber: 'PRO201908961663',
        projectName: 'Lot 21 Plantation Grove Master',
        address: '225 Plantation Grove Dr.',
        permitDate: '04-09-2020',
        coDate: '04-09-2020',
        closedDate: '04-09-2020'
    },
    {   
        lotNumber: 'PRO201908961663',
        projectName: 'Lot 23 Plantation Grove Master',
        address: '225 Plantation Grove Dr.',
        permitDate: '04-09-2020',
        coDate: '04-09-2020',
        closedDate: '04-09-2020'
    },
    {   
        lotNumber: 'PRO201908961663',
        projectName: 'Lot 25 Plantation Grove Master',
        address: '225 Plantation Grove Dr.',
        permitDate: '04-09-2020',
        coDate: '04-09-2020',
        closedDate: '04-09-2020'
    },
]


export const getProperties = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve(tempData);
        } catch (error) {
            reject(error);
        }
    })
}