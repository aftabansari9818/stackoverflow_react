import { AppBar, Box, Button, Container, TextField, Toolbar, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import './App.css';

const columns = [
  {
    field: 'title', headerName: 'Title', width: 700
  },
  {
    field: 'answer_count', headerName: 'Answer Count', width: 120
  },
  {
    field: 'score', headerName: 'Score', width: 80
  },
  {
    field: 'view_count', headerName: 'View Count', width: 100
  },
  {
    field: 'link', headerName: 'Link', width: 100,
    renderCell: (props) => {
      return (
        <a href={props.value} rel="noreferrer" target='_blank'>
          <Button variant="contained">
            <LaunchIcon />
          </Button>
        </a>)
    }
  },
]

const HOST = 'http://localhost'
const PORT = 8000

function App() {
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10
  })

  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    fetchData()
  }, [pageState.page, pageState.pageSize])

  const fetchData = async () => {
    setPageState(old => ({ ...old, isLoading: true }))
    try {
      if (searchText) {
        const response = await fetch(`${HOST}:${PORT}/api/search/?q=${searchText}&page=${pageState.page}&pagesize=${pageState.pageSize}`)
        const json = await response.json()
        setPageState(old => ({ ...old, isLoading: false, data: json.items, total: 100 }))
      } else {
        setPageState(old => ({ ...old, isLoading: false, data: [], total: 0 }))
      }
    } catch (error) {
      console.log(error);
      setPageState(old => ({ ...old, isLoading: false, data: [], total: 0 }))
    }
  }
  const searchSubmit = () => {
    fetchData()
  }


  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            StackOverFlow Advanced Search
          </Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: 100, marginBottom: 100 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <TextField
            size="small" label="Search" color="primary" style={{ marginRight: '1rem', width: '50%' }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button onClick={searchSubmit} variant="contained">
            Submit
          </Button>
        </div>
        {
          pageState.data && pageState.data.length > 0 &&
          <DataGrid
            autoHeight
            disableSelectionOnClick
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
        }
      </Container>
    </Box >
  )
}

export default App;