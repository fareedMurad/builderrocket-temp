import React, { useEffect, useState } from 'react';
import { 
    Table, 
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './CustomerDocuments.scss';


const CustomerDocuments = () => {
    const documents = useSelector(state => state.customer.documents);

    return (
        <div className='d-flex customer-documents'>
            <div className='customer-documents-container'>
                <div className='customer-documents-table'>
                    <Table hover responsive>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Document Type Name</th>
                                <th>File Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents?.map((doc, index) => (
                                <tr key={index}>
                                    <td>{doc?.ProjectName}</td>
                                    <td width='25%'>{doc?.DocumentTypeName}</td>
                                    <td><a 
                                        href={doc?.URL} 
                                        target='_blank'
                                        rel='noreferrer'
                                    >
                                        {doc?.FileName}
                                    </a></td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default CustomerDocuments;