package com.project.www.service;

import com.project.www.repository.AutoComMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AutoComServiceImpl implements AutoComService{

    @Autowired
    AutoComMapper autoComMapper;


    @Override
    public List<Map<String, Object>> autocomplete(Map<String, Object> paramMap) throws Exception {
        return autoComMapper.autocomplete(paramMap);
    }

}