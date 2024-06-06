package com.project.www.controller;

import com.project.www.service.AutoComService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Slf4j
@Controller
public class AutoComController {

    @Autowired
    AutoComService service;

    @RequestMapping(value = "/ajax/autocomplete.do")
    public @ResponseBody Map<String, Object> autocomplete(@RequestParam Map<String, Object> paramMap) throws Exception{
        List<Map<String, Object>> resultList = service.autocomplete(paramMap);
        paramMap.put("resultList", resultList);
        return paramMap;
    }
}