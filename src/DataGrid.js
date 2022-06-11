import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import './App.css';

const columns = [
    {
        field: 'title', headerName: 'Title', width: 500
    },
    {
        field: 'answer_count', headerName: 'Answer Count'
    },
    {
        field: 'score', headerName: 'Score'
    },
    {
        field: 'view_count', headerName: 'View Count'
    },
    {
        field: 'link', headerName: 'Link'
    },
]

function App() {
    const [pageState, setPageState] = useState({
        isLoading: false,
        data: [],
        total: 0,
        page: 1,
        pageSize: 10
    })

    useEffect(() => {
        const fetchData = async () => {
            console.log('ON')
            setPageState(old => ({ ...old, isLoading: true }))
            const response = await fetch(`http://localhost:8000/api/search/?q=react&page=${pageState.page}&pagesize=${pageState.pageSize}`)
            const json = await response.json()
            console.log("json->", json);
            setPageState(old => ({ ...old, isLoading: false, data: json.items, total: 10 }))
        }
        fetchData()
    }, [pageState.page, pageState.pageSize])


    return <Box>
        <AppBar>
            <Toolbar>
                <Typography variant="h6" component="div">
                    Server-side Pagination demo
                </Typography>
            </Toolbar>
        </AppBar>
        <Container style={{ marginTop: 100, marginBottom: 100 }}>
            <DataGrid
                autoHeight
                rows={pageState.data}
                getRowId={(row) => row.question_id}
                rowCount={pageState.total}
                loading={pageState.isLoading}
                rowsPerPageOptions={[10, 30, 50, 70, 100]}
                pagination
                page={pageState.page - 1}
                pageSize={pageState.pageSize}
                paginationMode="server"
                onPageChange={(newPage) => {
                    setPageState(old => ({ ...old, page: newPage + 1 }))
                }}
                onPageSizeChange={(newPageSize) => setPageState(old => ({ ...old, pageSize: newPageSize }))}
                columns={columns}
            />
        </Container>
    </Box>
}

export default App;