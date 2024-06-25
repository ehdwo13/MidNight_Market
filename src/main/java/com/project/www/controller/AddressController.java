package com.project.www.controller;

import com.project.www.domain.AddressVO;
import com.project.www.service.AddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/address/*")
@RequiredArgsConstructor
@Slf4j
public class AddressController {
    private final AddressService asv;
    private int isOK;

    @GetMapping("/register")
    public void register() {}

    @PostMapping("/register")
    public String register(AddressVO avo) {
        isOK = asv.register(avo);
        return "/payment/addrModifyPopup";
    }

    @ResponseBody
    @GetMapping("/list")
    public List<AddressVO> list() {
        List<AddressVO> list = asv.getList();

        // 기본배송지가 맨위로 오게
        list.sort((a1, a2) -> {
            if (a1.getIsMain().equals("Y") && a2.getIsMain().equals("N")) {
                return -1; // a1이 우선순위
            } else if (a1.getIsMain().equals("N") && a2.getIsMain().equals("Y")) {
                return 1; // a2가 우선순위
            } else {
                return 0; // 동일하면 그대로
            }
        });
        return list;
    }

    @ResponseBody
    @PutMapping("/address/updateIsMain")
    public AddressVO updateIsMain(@RequestBody AddressVO avo) {
        isOK = asv.update(avo);
        AddressVO address = asv.getAddress(avo);
        return isOK > 0 ? address : null;
    }

    @ResponseBody
    @DeleteMapping("/delete/{ano}")
    public String delete(@PathVariable("ano") long ano) {
        isOK = asv.delete(ano);
        return "redirect:/address/list";
    }

}

