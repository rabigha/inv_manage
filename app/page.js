'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { collection, deleteDoc, getDocs, getDoc, query, setDoc, doc, updateDoc } from "firebase/firestore";
import Head from 'next/head';
export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setSearchResults(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const updateItemName = async (oldName, newName) => {
    const oldDocRef = doc(collection(firestore, 'inventory'), oldName);
    const newDocRef = doc(collection(firestore, 'inventory'), newName);
    const oldDocSnap = await getDoc(oldDocRef);
    if (oldDocSnap.exists()) {
      const { quantity } = oldDocSnap.data();
      await setDoc(newDocRef, { quantity });
      await deleteDoc(oldDocRef);
    }
    await updateInventory();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    setSearchResults(results.length > 0 ? results : [{ name: 'Item not found', quantity: 0 }]);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setIsUpdating(false);
    setCurrentItem(null);
  };

  const handleUpdateClick = (name) => {
    setCurrentItem(name);
    setItemName(name);
    setIsUpdating(true);
    setOpen(true);
  };

  return (
    
    
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={2} bgcolor="#6b705c">
      <Modal open={open} onClose={handleClose}>
        <Box
          position="fixed"
          top="50%"
          left="50%"
          
          width={400}
          bgcolor="#d9d9d9"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{transform:"translate(-50%, -50%)"}}>
          <Typography variant="h6" sx={{ color: "black" }}>{isUpdating ? 'Update Item' : 'Add Item'}</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                if (isUpdating) {
                  updateItemName(currentItem, itemName);
                } else {
                  addItem(itemName);
                }
                handleClose();
              }}
              sx={{ bgcolor: "#012a4a" }}
            >
              {isUpdating ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ bgcolor: "#2f3e46" }}
        >
          Add New Item
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#d9d9d9" }}/>
              </InputAdornment>
            ),
          }}
          sx={{ 
            bgcolor: '#132a13', 
            input: { color: 'white' },
            borderRadius: '4px',
            border: '1px solid transparent'
          }}
        />
      </Stack>

      <Box width="800px" height="60vh" overflow="auto" border="1px solid #333" mt={2}>
        <Box width="100%" height="100px" bgcolor="#8a817c" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="white">
            Pantry Management
          </Typography>
        </Box>
        <Stack>
          {searchResults.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#d9d9d9"
              padding={5}>
              <Typography variant="h4" color="#333d29" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              {name !== 'Item not found' && (
                <>
                  <Typography variant="h4" color="#333d29" textAlign="center">
                    {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => addItem(name)} sx={{ bgcolor: "#2f3e46" }}>
                      Add
                    </Button>
                    <Button variant="contained" onClick={() => removeItem(name)} sx={{ bgcolor: "#2f3e46" }}>
                      Remove
                    </Button>
                    <Button variant="contained" onClick={() => handleUpdateClick(name)} sx={{ bgcolor: "#2f3e46" }}>
                      Update
                    </Button>
                  </Stack>
                </>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}